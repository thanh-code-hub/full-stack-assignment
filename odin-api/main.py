import overpy
from fastapi import FastAPI, HTTPException, Query
import httpx
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

app = FastAPI()
api = overpy.Overpass()

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
async def get_seamark_lights():
    """
    TODO: get the bbox coords from FE
    :return:
    """
    bbox = "59.77847599974091, 22.2908182629724, 59.947751078236365, 22.638044070378744"
    query = "[out:json];node[\"seamark:light:range\"](59.8, 22.3, 59.9, 22.6);out;"

    try:
        result = api.query(query)
        print(result.areas)
    except overpy.exception.OverpassTooManyRequests:
        raise HTTPException(status_code=429, detail="Rate limit from Overpass")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error while fetching from Overpass: {exc}") from exc


    items = []

    for node in result.nodes:
        items.append([node.lon, node.lat])

    return items

@app.get("/ship")
async def get_vehicle_location():
    return [22.30606, 59.89134]

