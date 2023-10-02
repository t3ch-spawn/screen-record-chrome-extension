var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  let controlPanel = document.createElement("div");
  controlPanel.classList.add(".control-panel");
  controlPanel.insertAdjacentHTML(
    "afterbegin",
    `<div style="display: flex;
                    gap: 20px;
                    justify-items: center;
                    align-items: center;
      ">
      <p style = "cursor: pointer" class="myStop">Stop</p>
      <p class="myPause">Pause</p>
</div>`
  );

  let styles = {
    backgroundColor: "black",
    borderRadius: "10px",
    padding: "10px",
    position: "fixed",
    left: "40px",
    bottom: "20px",
    width: "300px",
    color: "white",
  };

  Object.assign(controlPanel.style, styles);

  // stop.style.backgroundColor = 'red'
  // stop.textContent = "STOP"
  // stop.style.position = "absolute"
  // stop.style.top = "0"
  // stop.style.left = "0"
  document.body.appendChild(controlPanel);

  document.querySelector(".myStop").addEventListener("click", () => {
    if (!recorder) return console.log("no recorder");

    console.log(recorder);
    recorder.stop();

    document.body.removeChild(controlPanel);
  });

  // event that triggers the pausing of the recording
  let isPaused = false;
  let pauseBtn = document.querySelector(".myPause");
  pauseBtn.addEventListener("click", () => {
    if (!recorder) return console.log("no recorder");

    console.log(recorder);
    if (!isPaused) {
      recorder.pause();
      pauseBtn.innerHTML = "play";
      isPaused = true;
    } else {
      recorder.resume();
      pauseBtn.innerHTML = "pause";
      isPaused = false;
    }
  });

  recorder.onStop = () => {
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
 
    console.log("i have stopped");

    document.body.removeChild(controlPanel);
  };

  recorder.ondataavailable = (event) => {
    console.log(event.data);
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "request_recording") {
    // console.log("request_recording");
    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 99999999999,
          height: 99999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  //   if (message.action == "stop_recording") {
  //     sendResponse(`processed: ${message.action}`);
  //   }
});
