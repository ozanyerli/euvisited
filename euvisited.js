console.log("Hello");
const HOVER_COLOR = "#013395"
const MAP_COLOR = "#707173"

d3.json('eu-countries.json').then(function (data) {
    let width = 1200; height = 800;
    let projection = d3.geoEqualEarth();
    projection.fitSize([width, height], data);
    let path = d3.geoPath().projection(projection);

    let svg = d3.select("#map_container").append('svg').attr("width", width).attr("height", height);


    let g = svg.append('g').selectAll('path').data(data.features).join('path').attr('d', path).attr('fill', MAP_COLOR).attr('stroke', '#000')
        .on("mouseover", function (d, i) {
            d3.select(this).attr("fill", HOVER_COLOR)
        })

        .on("mouseout", function (d, i) {
            if (!d.noFill)
                d3.select(this).attr("fill", MAP_COLOR)
        })
        .on("click", function (d, i) {
            d.noFill = d.noFill || false;
            if (!d.noFill) {
                d3.select(this).attr("fill", HOVER_COLOR);
            } else {
                d3.select(this).attr("fill", MAP_COLOR);
            }
            d.noFill = !d.noFill;
        });


    console.log(data.features.map((f) => f.properties.NAME))

    g = svg.append('g')

    g
        .selectAll("text")
        .data(data.features)
        .enter()
        .append("text")
        .text(function (d) {
            return d.properties.NAME;
        })
        .attr("x", function (d) {
            return path.centroid(d)[0];
        })
        .attr("y", function (d) {
            return path.centroid(d)[1];
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '11pt')
        .attr('fill', 'white')
        .attr('style', 'pointer-events: none;')
        .attr('style', 'text-shadow: 0 0 0.5em #000;');

});

function downloadMap() {

    let div = document.getElementById('map_container')
    html2canvas(div).then(
        function (canvas) {

            var destCanvas = document.createElement('canvas');
            destCanvas.width = canvas.width;
            destCanvas.height = canvas.height;
            var destCtx = destCanvas.getContext('2d')
            destCtx.drawImage(canvas, 0, 0)

            const ctx = destCanvas.getContext('2d')
            ctx.textBaseline = "top"
            ctx.font = "2.5em Calibri";
            ctx.fillStyle = "black";
            ctx.textAlign = "start";
            ctx.fillText("ozanyerli.github.io/euvisited", 10, canvas.height - 27);
            ctx.fillText('Countries I have visited in Europe!', 10, 10)
            

            destCanvas.toBlob(function (blob) {
                saveAs(blob, "euvisited.png")
            }) 
        })
}