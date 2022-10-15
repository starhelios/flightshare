import {
  BrowserView,
  MobileView
} from "react-device-detect";

import MapBoxComponent from "../components/MapBoxComponent";

function Home() {
  return (
    <div>
      <div className="text-center">
        <MobileView>
          <MapBoxComponent isMobile />
        </MobileView>
        <BrowserView>
          <MapBoxComponent />
        </BrowserView>
      </div>
    </div>
  );
}

export default Home;
