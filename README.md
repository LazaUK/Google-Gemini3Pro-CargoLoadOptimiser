# Van Load Optimisation by CLOA, powered by Gemini 3 Pro
**CLOA** (_Container Load Optimisation App_) is a 3D visualisation tool, designed to maximise the efficiency of cargo van loading. It simulates the placement of various standard parcel types into a fixed-size cargo van, generates real-time utilisation statistics and uses the _Gemini API_ to provide AI optimisation insights.

## 📑 Table of Contents
- [Optimisation Challenge](#optimisation-challenge)
- [Solution Logic and Architecture]()
- [Run Locally]()
- [Run Docker Container]()
- [Demos]()

## Optimisation Challenge
This app is designed to assist with the load optimisation challenge, which requires efficient arrangement of a given set of defined items within larger container. It's currently tuned for a standard delivery vehicle:
- **Container Dimensions** (L x W x H): _3.0_ m x _1.8_ m x _1.9_ m.
- **Total Volume**: _10.26_ m^3.

The van load optimisation process assumes the use of the following parcel types:

| Type   | Dimensions (L x W x H) | Volume    | Colour Code |
| ------ | ---------------------- | --------- | ----------- |
| Small  | 0.30m x 0.20m x 0.15m  | 0.009 m^3 | Green       |
| Medium | 0.50m x 0.40m x 0.30m  | 0.060 m^3 | Blue        |
| Large  | 0.75m x 0.50m x 0.60m  | 0.225 m^3 | Red         |

> [!NOTE]
> The underlying parcel-packing logic can be extended to address complex logistics and manufacturing challenges outside of cargo van loading:
> - **Diverse Container Types**: The app can be adapted to optimise loading for various transport vessels, such as _shipping containers_, _rail wagons_ or _aircraft cargo_, by updating the **_CONTAINER_** dimensions defined within `types.ts`.
> - **Internal Product Packaging**: The packing principles apply at a micro-level. For instance, the same solution logic could be used to optimise the _arrangement of internal components_ (e.g., circuit boards, batteries) within a final product's casing, helping to minimise the product's size or reduce wasted space.
> - **Advanced Constraints**: The logic can be extended to include complex logistical constraints, such as optimising for _weight distribution_ (**_centre of gravity_**) or _fragility rules_ (prohibiting the stacking of delicate items).

## Solution Logic and Architecture
The app is built using _React_ front-end and provides an interactive 3D visualisation using _Three.js_ library.

### Cargo Packing Simulation
The packing calculation is managed by the **_packContainer_** service, which accepts user input from the `ControlPanel.tsx` component:
- **Input**: Users specify the quantity for the three standard parcel types.
- **Logic**: The heuristic solver calculates the optimal 3D coordinates for each parcel, allowing for full rotation to achieve the highest possible packing density.
- **Visualisation**: The result is displayed in a rotatable 3D model, where each parcel is clearly colour-coded by type (_Small/Green_, _Medium/Blue_, _Large/Red_).

### 2. AI Optimisation Assistant
AI-based feedback and suggestions can be generated, leveraging the _Gemini API_:
- The `getOptimizationInsights` service is triggered after the simulation. It passes the raw packing data (placed and unplaced items, utilisation) to the **_Gemini_** model.
- **_Gemini_** analyses the loading statistics and returns actionable recommendations (e.g., "_Consider reducing the number of Large parcels by 2, as they are causing significant gaps_")
- The _Gemini API Key_ is loaded from the `.env.local` file and injected via `vite.config.ts`.

## Run Locally
The application uses Node.js and Vite for the development environment.

> [!ATTENTION]
> Prerequisites: **Node.js**

1. Install dependencies:

``` Bash
npm install
```

2. Set the `GEMINI_API_KEY`: Update the GEMINI_API_KEY in [.env.local](.env.local) with your personal Gemini API key.

3. Run the application:

``` Bash
npm run dev
```

> [!NOTE]
> The programme will typically be accessible in your web browser at http://localhost:3000.

## Run Docker Container
For a consistent and portable environment, the repo offers a pre-packaged Docker container companion. You can run it with the following Docker CLI command:

``` Bash
docker run -d -p 3000:3000 --env GEMINI_API_KEY="YOUR_API_KEY" cloa-app
```

> [!NOTE]
> The programme will be accessible in your browser at http://localhost:3000.
> The --env flag is mandatory to pass the required GEMINI_API_KEY environment variable into the running container.

## Demos
To see the CLOA application in action:

- Published Programme Link: [Insert Link Here]
- Video Demonstration: [Insert YouTube Link Here]
