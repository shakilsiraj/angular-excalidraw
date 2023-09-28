// import React, { React.useEffect, React.useState, useRef } from "react";
import * as React from "react";
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from "@excalidraw/excalidraw";
import InitialData from "./initialData";

import "../reactstyles.scss";
import initialData from "./initialData";

const renderTopRightUI = () => {
  return (
    <button onClick={() => alert("This is dummy top right UI")}>
      {" "}
      Click me{" "}
    </button>
  );
};

const renderFooter = () => {
  return (
    <button onClick={() => alert("This is dummy footer")}>
      {" "}
      custom footer{" "}
    </button>
  );
};

export default function App() {
  const excalidrawRef = React.useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);
  const [blobUrl, setBlobUrl] = React.useState(null);
  const [canvasUrl, setCanvasUrl] = React.useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = React.useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: []
        }
      ],
      appState: {
        viewBackgroundColor: "#edf2ff"
      }
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  return (
    <div className="App">
      <h1> Excalidraw Here</h1>
      <div className="button-wrapper">
        <button className="update-scene" onClick={updateScene}>
          Update Scene
        </button>
        <button
          className="reset-scene"
          onClick={() => {
            excalidrawRef.current.resetScene();
          }}
        >
          Reset Scene
        </button>
        <label>
          <input
            type="checkbox"
            checked={viewModeEnabled}
            onChange={() => setViewModeEnabled(!viewModeEnabled)}
          />
          View mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={zenModeEnabled}
            onChange={() => setZenModeEnabled(!zenModeEnabled)}
          />
          Zen mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={gridModeEnabled}
            onChange={() => setGridModeEnabled(!gridModeEnabled)}
          />
          Grid mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={() => {
              let newTheme = "light";
              if (theme === "light") {
                newTheme = "dark";
              }
              setTheme(newTheme);
            }}
          />
          Switch to Dark Theme
        </label>
      </div>
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={InitialData}
          onChange={(elements, state) =>
            console.log("Elements :", elements, "State : ", state)
          }
          onPointerUpdate={(payload) => console.log(payload)}
          onCollabButtonClick={() =>
            window.alert("You clicked on collab button")
          }
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          theme={theme}
          name="Custom name of drawing"
          UIOptions={{ canvasActions: { loadScene: false } }}
          renderTopRightUI={renderTopRightUI}
          renderFooter={renderFooter}
        />
      </div>

      <div className="export-wrapper button-wrapper">
        <label className="export-wrapper__checkbox">
          <input
            type="checkbox"
            checked={exportWithDarkMode}
            onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
          />
          Export with dark mode
        </label>
        <label className="export-wrapper__checkbox">
          <input
            type="checkbox"
            checked={shouldAddWatermark}
            onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
          />
          Add Watermark
        </label>
        <button
          onClick={async () => {
            const svg = await exportToSvg({
              elements: excalidrawRef.current.getSceneElements(),
              appState: {
                ...initialData.appState,
                exportWithDarkMode,
                // shouldAddWatermark,
                width: 300,
                height: 100
              }
              // embedScene: true
            });
            document.querySelector(".export-svg").innerHTML = svg.outerHTML;
          }}
        >
          Export to SVG
        </button>
        <div className="export export-svg"></div>

        <button
          onClick={async () => {
            const blob = await exportToBlob({
              elements: excalidrawRef.current.getSceneElements(),
              mimeType: "image/png",
              appState: {
                ...initialData.appState,
                exportWithDarkMode
                // shouldAddWatermark
              }
            });
            setBlobUrl(window.URL.createObjectURL(blob));
          }}
        >
          Export to Blob
        </button>
        <div className="export export-blob">
          <img src={blobUrl} alt="" />
        </div>

        <button
          onClick={() => {
            const canvas = exportToCanvas({
              elements: excalidrawRef.current.getSceneElements(),
              appState: {
                ...initialData.appState,
                exportWithDarkMode
                // shouldAddWatermark
              }
            });
            const ctx = canvas.getContext("2d");
            ctx.font = "30px Virgil";
            ctx.strokeText("My custom text", 50, 60);
            setCanvasUrl(canvas.toDataURL());
          }}
        >
          Export to Canvas
        </button>
        <div className="export export-canvas">
          <img src={canvasUrl} alt="" />
        </div>
      </div>
    </div>
  );
}
