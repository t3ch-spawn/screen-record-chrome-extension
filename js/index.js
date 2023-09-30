document.addEventListener("DOMContentLoaded", () => {
  // defining selectors
  const startRecordBtn = document.querySelector(".start_record");
  const stopRecordBtn = document.querySelector(".stop_record");

  startRecordBtn.addEventListener("click", () => {
    // find the tab the user is currently on
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "request_recording" },
        (response) => {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 14");
          }
        }
      );
    });
  });

//   stopRecordBtn.addEventListener("click", () => {
//     // find the tab the user is currently on
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(
//         tabs[0].id,
//         { action: "stop_recording" },
//         (response) => {
//           if (!chrome.runtime.lastError) {
//             console.log(response);
//           } else {
//             console.log(chrome.runtime.lastError, "error line 27");
//           }
//         }
//       );
//     });
//   });
});
