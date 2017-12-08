# Nearby Restaurants Map Search
# Overview
NearbyRestaurantsMap web app enables users to search the restaurants:fork_and_knife:, cafes:coffee:, bars:beers: etc. around a circular area on a map. Found restaurants can be filtered using different criteria's like rating, cost. GOOGLE MAP API is used for the map and ZOMATO API for the restaurants data.

# Content:
- [Usage Walkthrough](#usage-walkthrough)
  - [Quick Start](#quick-start)
  - [Detailed Walkthrough and Restrictions](#detailed-walkthrough)
- [Technologies](#technologies)
- [About APIs used](#about-apis-used)
- [Project Setup](#project-setup)
  - [Get API KEYs:key:](#get-api-keys)
  - [Place the API Keys](#place-the-api-keys)
  - [Load the map of different city](#load-the-map-of-different-city)
- [Code Attribution](#code-attribution)
- [Possible Enhancements](#possible-enhancements)

# Usage Walkthrough
**Note:** Zomato uses [OpenStreetMap](https://www.openstreetmap.org/), plotted markers location could be slightly different when viewed on Google Map.

## Quick Start
Getting restaurants, bars, cafes in the area in three simple steps:<br>
**Note:** Open **index.html** in javascript enabled browser.
1. Click the **bouncing down arrow** on the top right corner, to open options box.
    <details>
      <summary>Screenshot</summary>
      <img alt="Option Box" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/OptionsBox.JPG">
    </details>

2. Click **Drawing Tools** and draw a circle on the map.
    <details>
      <summary>Screenshot</summary>
      <img alt="Draw Circle" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/DrawCircle.JPG">
    </details>

3. Click **Search Restaurants**

    <details>
      <summary>Screenshot</summary>
      <img alt="Search Restaurants" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/SearchedMarkers.JPG">
    </details>

<br>
In a happy scenario, you should get a list of restaurants within the circle and new filter button on the left. Click it to explore filter options.
  <details>
    <summary>Screenshot</summary>
    <img alt="Filters" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/Filter.JPG">
  </details>

## Detailed Walkthrough
### Zoom into location
  <details>
    <summary>Screenshot</summary>
    <img alt="Enter Zoom in Text" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/EnterZoomText.JPG">
  </details>

#### Usage
Given location is loaded and the map is centered on it.

#### Restrictions
Zoom navigation is restricted to the places specified by the `componentRestrictions` in the code.<br>
It is currently set to the city: **Mumbai, India**

## Drawing a circle on the map
  <details>
    <summary>Screenshot</summary>
    <img alt="Drawing Tools Circle" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/DrawCircle.JPG">
  </details>

#### Usage
Enables you to draw, resize and reposition a circle on the map.

#### Restrictions
Only one circle is allowed at a time.

## Searching Restaurants
  <details>
    <summary>Screenshot</summary>
    <img alt="Searched Markers" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/SearchedMarkers.JPG">
  </details>

#### Usage
Enables you to draw, resize and reposition a circle on the map.

#### Restrictions
Zomato's free API key fetches maximum 20 locations. The locations are sorted by ascending order of the distance from the center of the circle. In the case of a circle covering a very large area, the locations may be dense near the center.

### Filter Options Sidebar
  <details>
    <summary>Screenshot</summary>
    <img alt="FILTER Sidebar" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/LeftSidebar.JPG">
  </details>

#### Usage
Once locations are plotted, **FILTER** sidebar button is visible on the left. Click it and sidebar will slide in.<br><br>
**Sidebar displays:**
1. an expandable **Filter menu**
2. **list** of all filtered places.

### Filter Menu
  <details>
    <summary>Screenshot</summary>
    <img alt="Filter options" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/Filter.JPG">
  </details>

The visible list of places on the sidebar and markers on the map satisfies all the selected filter conditions.
#### Options
1. Filter by **Cuisine Type** , ex. all, bakery:cake:, cafe:coffee:, pizza:pizza:
2. Filter by **Max cost for two** :dollar:, between the minimum and maximum costs of the obtained places.
3. Filter by **Minimum Rating** :star:, between 0-5

### Information window
  <details>
    <summary>Screenshot</summary>
    <img alt="InfoWindow" src="https://vbhosle.github.io/NearbyRestaurantsMapDoc/walkthrough/InfoWindow.JPG">
  </details>

Clicking on the listed restaurant name  or the marker plotted on the map, the restaurant is highlighted and details about the corresponding restaurant pop up.

### New Search
After a successful search, top right option box offers only a **New Search** option.<br>
On clicking **New Search** , previous search results are cleared.

# Technologies
* **Web technologies:** HTML, CSS, Javascript
* **Javascript libraries/frameworks:** JQuery, KnockoutJS
* **APIs:** GOOGLE MAP Javascript API, ZOMATO API

# About APIs Used
_(as of 2017)_
## Google Maps Javascript API
With Google Maps API, you can create **interactive applications using Google maps** .<br>
It provides various libraries:
- **drawing** provides a graphical interface for users to draw polygons, rectangles, polylines, circles, and markers on the map.
- **geometry** includes utility functions for calculating scalar geometric values (such as distance and area) on the surface of the earth.
- **places** enable your application to search for places such as establishments, geographic locations, or prominent points of interest, within a defined area.
- **visualization** provides heatmaps for visual representation of data.<br>

For detailed documentation visit [Google Maps API](https://developers.google.com/maps/documentation/javascript/).

## ZOMATO API for restaurants data
Zomato APIs provides most exhaustive information for **over 1.5 million restaurants across 23 countries and 10,000 cities globally**. With the Zomato APIs, you can:
* **Search** for restaurants by name, cuisine, or location
* **Display detailed information** including ratings, location and cuisine
* Use the Zomato **Foodie Index** to show great areas to dine in a city

For usage details, visit [Zomato API](https://developers.zomato.com/api)

# Project Setup

## Get API KEYs

### Get the GOOGLE MAP API key
1. Visit https://console.developers.google.com
2. Sign in with your Google - i.e. yourname@gmail.com. If you don't have one, you can go to accounts.google.com to create one for free.
3. Visit https://developers.google.com/maps/documentation/javascript/libraries and click **GET KEY**
    <details>
      <summary>Screenshot</summary>
      <img alt="GET GOOGLE API KEY" src="https://github.com/vbhosle/vbhosle.github.io/blob/master/NearbyRestaurantsMapDoc/googleapi/GetKey.JPG">
    </details>

4. **Enable Google Maps Javascript API** window pops up.<br>
Specify a descriptive project name. Read and accept the terms and conditions.
    <details>
      <summary>Screenshot</summary>
      <img alt="New Project" src="https://github.com/vbhosle/vbhosle.github.io/blob/master/NearbyRestaurantsMapDoc/googleapi/NewProject.JPG">
    </details>

5. All Set!<br>
Copy the generated API KEY. This action automatically enables **Google Maps Javascript API and Geocoding API.**
    <details>
      <summary>Screenshot</summary>
      <img alt="All Set" src="https://github.com/vbhosle/vbhosle.github.io/blob/master/NearbyRestaurantsMapDoc/googleapi/AllSet.JPG">
    </details>

#### Restrict GOOGLE MAP API KEY [optional]
1. Go to https://console.developers.google.com, it will land on the dashboard.
2. Select the project you created. Then **Credentials.**
    <details>
      <summary>Screenshot</summary>
      <img alt="Restrict KEY" src="https://github.com/vbhosle/vbhosle.github.io/blob/master/NearbyRestaurantsMapDoc/googleapi/RestrictKey.JPG">
    </details>
3. Now you can restrict the API KEY usage to your application server only.

### Get the ZOMATO API key
1. Go to https://developers.zomato.com/api
2. Sign in using existing Google/Facebook account or create a new account. If you are using existing accounts, allow ZOMATO access to your age and language.
3. Enter your details to get the API KEY.
4. You can experiment with the API right away on [documentation page](https://developers.zomato.com/documentation)

## Place the API Keys
1. In :pencil: **index.html** , look for `key=GOOGLE_MAP_API_KEY`, in the &lt;script&gt; tag nearly at the end of the HTML file. Replace the `GOOGLE_MAP_API_KEY` with your Google Map Key. Don't add any spaces around.

2. In :pencil: **js/thirdPartyAPI.js** , look for `ZOMATO_API_KEY = 'PASTE_ZOMATO_KEY';`
Replace `PASTE_ZOMATO_KEY` with your ZOMATO KEY. Again no spaces around.

## Load the map of different city
**Current setup is for Mumbai, India** <br>
:bulb: **Tip:** Use [Google's geocode tool](https://google-developers.appspot.com/maps/documentation/utils/geocoder/) to get the lat/longs, country code, and administrativeArea.<br>
:warning: **Important Note:** Only use the countries for which **Zomato** data is available.
For details, visit [Zomato](https://www.zomato.com/about).
1. In :pencil: **js/app.js** , `initMap` function, put the latitude and longitude of the city in `{lat: , lng: }`
```Javascript
map = new google.maps.Map(document.getElementById('map'), {
  styles: styles,
  center: {lat: 19.190638, lng: 72.834392},//Mumbai IN
  .
  .
}
```

2. In :pencil: **js/app.js** , look for the following code:
```Javascript
geocoder.geocode(
        { address: address,
          componentRestrictions: {country:'IN', administrativeArea: 'Mumbai'}
  .
  .
}
```
Change `componentRestrictions` as per the city specified in first step with country code and city name.<br>

# Code Attribution
- Zoom in location code inspired by Udacity's repo https://github.com/udacity/ud864
- Bouncing arrow inspired by https://codepen.io/dodozhang21/pen/siKtp
- Custom scrollbar inspired by https://codepen.io/devstreak/pen/dMYgeO


# Possible Enhancements
* Add place-autocomplete for zoom text box, [reference](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
* Add restaurant thumbnail in the details.
* Navigation with keyboard shortcuts
* Add more filter options based on
  * Has online delivery
  * Has table booking
  * input text-based filter with autocomplete.
* Gracefully spring apart overlapping location markers on click, with [OverlappingMarkerSpiderfier library](https://github.com/jawj/OverlappingMarkerSpiderfier)
