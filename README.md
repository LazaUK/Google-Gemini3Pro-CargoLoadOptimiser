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
> - **Diverse Container Types**: The app can be adapted to optimise loading for various transport vessels, such as _shipping containers_, _rail wagons_ or _aircraft cargo_, by updating the **_CONTAINER_** dimensions defined within **_types.ts_**.
> - **Internal Product Packaging**: The packing principles apply at a micro-level. For instance, the same solution logic could be used to optimise the _arrangement of internal components_ (e.g., circuit boards, batteries) within a final product's casing, helping to minimise the product's size or reduce wasted space.
> - **Advanced Constraints**: The logic can be extended to include complex logistical constraints, such as optimising for _weight distribution_ (**_centre of gravity_**) or _fragility rules_ (prohibiting the stacking of delicate items).
