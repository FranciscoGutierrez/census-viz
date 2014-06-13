/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 CensusViz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/* Stats View Component.
 * Universidad de las Américas Puebla http://ict.udlap.mx
 * As part of REAUMOBILE project.
 * Author: Francisco Gutiérrez (fsalvador23@gmail.com)
 */
document.registerElement('stats-view', {
                         prototype: Object.create(HTMLElement.prototype)
                         });
var url = $("stats-view").attr("data");
var data;
var json;

d3.json(url, function (error, jsondata) {
        if (error) return console.warn(error);
        json = jsondata;
        data = [{
                "metric": "Amigos Interesantes",
                "population": json.userLocalStats.d3PieChart[0].population
                }, {
                "metric": "Líderes de Opinión",
                "population": json.userLocalStats.d3PieChart[1].population
                }, {
                "metric": "Amigos Lejanos",
                "population": json.userLocalStats.d3PieChart[2].population
                }, {
                "metric": "Amigos Cercanos",
                "population": json.userLocalStats.d3PieChart[3].population
                }];
        visualizePieChart();
        });

var width = 350,
height = 250,
radius = Math.min(width, height)/2;

var color = d3.scale.ordinal()
.range(["#ff8394","#ffeb07","#20dd64","#48a4ff"]);

var arc = d3.svg.arc()
.outerRadius(radius - 30)
.innerRadius(48);

var pie = d3.layout.pie()
.sort(null)
.value(function (d) {
       return d.population;
       });

var svg = d3.select(".stats-view-graphic").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function visualizePieChart() {
    
    var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");
    
    g.append("path")
    .attr("d", arc)
    .attr("class", "path")
    .style("fill", function (d) {
           return color(d.data.metric);
           
           });
    
    g.append("text")
    .attr("class", "label")
    .attr("transform", function (d) {
          var dist = radius - 20;
          angle = (d.startAngle + d.endAngle) / 2; // Middle of wedge
          x = 1.28; //dist * Math.sin(angle); //Around the pie.
          y = 105; //-dist * Math.cos(angle); //Around the pie.
          return "translate(" + x + "," + y + ")";
          })
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
          return d.data.metric;
          });
    
    g.append("text")
    .attr("class", "label-meta")
    .attr("transform", function (d) {
          var dist = radius - 20;
          angle = (d.startAngle + d.endAngle) / 2;
          x = 1.28; //dist * Math.sin(angle); //Turn me on to around the pie.
          y = 105; //-dist * Math.cos(angle); //Turn me on to around the pie.
          return "translate(" + x + "," + y + ")";
          })
    .attr("dy", "1.75em")
    .attr("text-anchor", "middle")
    .text(function (d) {
          return d.data.population.toLocaleString() + " Amigos";
          });
    
    /*
     * Event handler: When document ready adds smooth fading effects.
     * Objects affected: .stats-view-box, path, path.next(), path.next().next().
     */
    $(document).ready(function () {
                      $("path").next().css("visibility", "hidden");
                      $("path").next().next().css("visibility", "hidden");
                      $(".stats-view-box").css("visibility", "visible");
                      $(".stats-view-box").addClass("animated slideInDown");
                      $(".stats-view-container").css("visibility", "visible");
                      $(".stats-view-container").addClass("animated fadeInDown");
                      });
    /*
     * Event handler:
     */
    $("path").mouseenter(function () {
                         var color = $(this).css("fill");
                         $(this).next().css("visibility", "visible");
                         $(this).next().next().css("visibility", "visible");
                         $(this).next().fadeIn(200);
                         $(this).next().next().fadeIn(200);
                         color = color.replace(/[^0-9,]+/g, "");
                         var red = color.split(",")[0];
                         var gre = color.split(",")[1];
                         var blu = color.split(",")[2];
                         $(this).css("fill", Lighthen(red, gre, blu, 0.85));
                         $(this).css("cursor", "pointer");
                         });
    /*
     * Event handler:
     */
    $("path").mouseleave(function () {
                         var color = $(this).css("fill");
                         $(this).next().fadeOut(200);
                         $(this).next().next().fadeOut(200);
                         color = color.replace(/[^0-9,]+/g, "");
                         var red = color.split(",")[0];
                         var gre = color.split(",")[1];
                         var blu = color.split(",")[2];
                         $(this).css("fill", Darken(red, gre, blu, 0.85));
                         $(this).css("fill-opacity", "1");
                         });
    /*
     * Event handler:
     */
    $("path").click(function () {
                    secondViewTrigger(this);
                    });
    
} // End of visualizePieChart(){}
/*
 * Lighthens an object given an RGB color set.
 * @param          red: The R-gb value.
 * @param        green: The r-G-b value.
 * @param         blue: The rG-B value.
 * @param   multiplier: the value to lighthen the object
 * @return  The Lighthen Hex (could be RGB) color set.
 */
function Lighthen(red, green, blue, multiplier) {
    var r = Math.round(red * multiplier);
    var g = Math.round(green * multiplier);
    var b = Math.round(blue * multiplier);
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    //return "rgb(" + r + "," + g + "," + b + ")";
}
/*
 * Darkens an object given an RGB color set.
 * @param          red: The R-gb value.
 * @param        green: The r-G-b value.
 * @param         blue: The rG-B value.
 * @param   multiplier: the value to darken the object
 * @return  The Darkened Hex (could be RGB) color set.
 */
function Darken(red, green, blue, multiplier) {
    var r = Math.round(red / multiplier);
    var g = Math.round(green / multiplier);
    var b = Math.round(blue / multiplier);
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    //return "rgb(" + r + "," + g + "," + b + ")";
}
/*
 * Rotates the text around the Pie chart given start and end angles
 * @param start: the start angle.
 * @param   end: the end angle.
 * @return  the angle where the text should be around the pie chart.
 */
function rotateText(start, end) {
    return (start + end) / 2 * (180 / Math.PI);
}

function secondViewTrigger(path) {
    var background = "url(http://goo.gl/zFISca) no-repeat center center";
    var color = $(path).css("fill");
    color = color.replace(/[^0-9,]+/g, "");
    var red = color.split(",")[0];
    var gre = color.split(",")[1];
    var blu = color.split(",")[2];
    var darken = Darken(red, gre, blu, 0.85);
    $(".stats-view-graphic").css("visibility", "hidden");
    $(".stats-view-title").fadeOut("fast");
    $(".stats-view-meta").fadeOut("fast");
    /* Append the new elements */
    $(".stats-view-container").append("<div class=\"stats-view-nav\"></div>");
    $(".stats-view-container").append("<div class=\"stats-view-list\"></div>");
    $(".stats-view-list").append("<div class=\"stats-view-minbox\"></div>");
    $(".stats-view-nav").append("<div class=\"stats-view-minpic\">");
    $(".stats-view-nav").append("<div class=\"stats-view-textnav\">");
    $(".stats-view-textnav").append("<div class=\"stats-view-mintitle\">");
    $(".stats-view-textnav").append("<div class=\"stats-view-minmeta\">");
    /* Style the minpic */
    $(".stats-view-minpic").css("background", background);
    $(".stats-view-minpic").css("background-size", "40px");
    $(".stats-view-minpic").css("color", "#fff");
    $(".stats-view-minpic").css("text-align", "center");
    $(".stats-view-minpic").css("font-weight", "bold");
    $(".stats-view-minpic").css("font-family", "Courier New");
    $(".stats-view-minpic").css("font-size", "25px");
    $(".stats-view-minpic").css("line-height", "43px");
    $(".stats-view-minpic").css("width", "40px");
    $(".stats-view-minpic").css("height", "40px");
    $(".stats-view-minpic").css("border", "8px " + darken + " solid");
    $(".stats-view-minpic").css("border-radius", "40px");
    $(".stats-view-minpic").css("cursor", "pointer");
    
    $(".stats-view-minbox").css("border", "1px solid #c1c1c1");
    $(".stats-view-minbox").css("border-radius", "3px");
    
    $(".stats-view-nav").css("text-align", "left");
    $(".stats-view-mintitle").append($(".stats-view-title").html());
    $(".stats-view-mintitle").css("font-size", "16px");
    $(".stats-view-minmeta").append($(".stats-view-meta").html());
    $(".stats-view-minmeta").css("font-size", "10px");
    $(".stats-view-minmeta").css("color", "gray");
    
    $(".stats-view-nav").css("top", "0");
    $(".stats-view-nav").css("margin", "10px");
    $(".stats-view-nav").css("position", "absolute");
    $(".stats-view-minpic").css("float", "left");
    $(".stats-view-textnav").css("float", "left");
    $(".stats-view-textnav").css("margin", "10px");
    
}

$("stats-view").on('mouseenter', '.stats-view-minpic', function () {
                   $(this).css("box-shadow", "inset 0px 0px 15px #000");
                   $(this).next().css("text-decoration", "underline");
                   $(this).next().css("cursor", "pointer");
                   });

$("stats-view").on('mouseleave', '.stats-view-textnav', function () {
                   $(".stats-view-minpic").css("box-shadow", "none");
                   $(this).css("text-decoration", "none");
                   });

$("stats-view").on('mouseenter', '.stats-view-textnav', function () {
                   $(".stats-view-minpic").css("box-shadow", "inset 0px 0px 15px #000");
                   $(this).css("text-decoration", "underline");
                   $(this).css("cursor", "pointer");
                   });

$("stats-view").on('mouseleave', '.stats-view-minpic', function () {
                   $(this).css("box-shadow", "none");
                   $(this).next().css("text-decoration", "none");
                   });

$("stats-view").on('click', '.stats-view-minpic', function () {
                   $(".stats-view-graphic").css("visibility", "visible");
                   $(".stats-view-title").fadeIn("fast");
                   $(".stats-view-meta").fadeIn("fast");
                   $(".stats-view-list").remove();
                   $(".stats-view-minbox").remove();
                   $(".stats-view-nav").fadeOut("fast", function () {
                                                $(this).remove();
                                                
                                                });
                   });

$("stats-view").on('click', '.stats-view-textnav', function () {
                   $(".stats-view-graphic").css("visibility", "visible");
                   $(".stats-view-title").fadeIn("fast");
                   $(".stats-view-meta").fadeIn("fast");
                   $(".stats-view-list").remove();
                   $(".stats-view-minbox").remove();
                   $(".stats-view-nav").fadeOut("fast", function () {
                                                $(this).remove();
                                                });
                   });