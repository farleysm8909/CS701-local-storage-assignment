self.onconnect = connectionHandler;

function connectionHandler(e) {
    let port = e.ports[0];
    port.addEventListener("message", (e) => {
        let starting_range = e.data.start;
        let ending_range = e.data.end;
        let totalSum = 0;
        for (let i = starting_range; i <= ending_range; i++) {
            totalSum += i;
        }
        port.postMessage({
            start: starting_range,
            end: ending_range,
            result: totalSum
        });  
    });
    port.start();    
}
  