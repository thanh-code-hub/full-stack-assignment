import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return "ODIN-API NOT FOUND"


@app.get("/sar_image",
         responses={
             200: {
                 "content": {"image/png": {}}
             }
         },
         response_class=FileResponse
         )
async def get_sar_image():
    return FileResponse(
        "SAR_image_20420212.png"
    )

@app.get("/sar_coords")
async def get_sar_coords():
    return [
        [22.2908182629724, 59.91614254645401],
        [22.578806773313246, 59.947751078236365],
        [22.638044070378744, 59.809992490984754],
        [22.351391574531174, 59.77847599974091],
    ]


@app.get("/seamarks")
async def get_seamark_lights(bbox: str):
    query = f"[out:json];node[\"seamark:light:range\"]({bbox});out;"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("https://overpass-api.de/api/interpreter", content=query)
            result = response.json()

        nodes = []

        for node in result["elements"]:
            nodes.append([node["lon"], node["lat"]])

        return nodes
    except Exception as e:
        print(f"Error while fetching seamarks: {e}")
        raise HTTPException(status_code=500, detail="Error while fetching seamarks")


@app.get("/ship")
async def get_vehicle_location():
    return [22.30606, 59.89134]
