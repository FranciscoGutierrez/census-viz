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
$("stats-view").append("<div class=\"stats-view-container\"></div>");
$(".stats-view-container").append("<div class=\"stats-view-graphic\"></div>");
$(".stats-view-container").append("<div class=\"stats-view-box\"></div>");
$(".stats-view-box").append("<div class=\"stats-view-title\"></div>");
$(".stats-view-box").append("<div class=\"stats-view-meta\"></div>");
d3.json(url, function (error, jsondata) {
        var background;
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
        background = "url(" + json.userLocalStats.picture + ") no-repeat center center";
        $(".stats-view-graphic").css("background", background);
        $(".stats-view-graphic").css("background-size", "110px");
        $(".stats-view-title").text(json.userLocalStats.name);
        $(".stats-view-meta").text(json.userLocalStats.location);
        visualizePieChart();
        });

var width = 350,
height = 250,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
.range(["#ff8394", "#ffeb07", "#20dd64", "#48a4ff"]);

var arc = d3.svg.arc()
.outerRadius(radius - 30)
.innerRadius(48);

var pie = d3.layout.pie()
.sort(null)
.value(function (d) {
       return d.population;
       });
var fixedWidth = width;
var fixedHeight = height - 62;

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
                      $(".stats-view-box").addClass("animated flipInX");
                      $(".stats-view-container").css("visibility", "visible");
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
    var picture = json.userLocalStats.picture
    var background = "url(" + picture + ") no-repeat center center";
    var color = $(path).css("fill");
    color = color.replace(/[^0-9,]+/g, "");
    var red = color.split(",")[0];
    var gre = color.split(",")[1];
    var blu = color.split(",")[2];
    var darken = Darken(red, gre, blu, 0.85);
    $(".stats-view-graphic").css("display", "none");
    $(".stats-view-box").css("display", "none");
    /* Append the new elements */
    $(".stats-view-container").append("<div class=\"stats-view-nav\"></div>");
    $(".stats-view-nav").append("<div class=\"stats-view-minpic\"></div>");
    $(".stats-view-nav").append("<div class=\"stats-view-textnav\"></div>");
    $(".stats-view-textnav").append("<div class=\"stats-view-mintitle\"></div>");
    $(".stats-view-textnav").append("<div class=\"stats-view-minmeta\"></div>");
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
    
    $(".stats-view-nav").css("text-align", "left");
    $(".stats-view-mintitle").append($(".stats-view-title").html());
    $(".stats-view-mintitle").css("font-size", "16px");
    $(".stats-view-minmeta").append($(".stats-view-meta").html());
    $(".stats-view-minmeta").css("font-size", "10px");
    $(".stats-view-minmeta").css("color", "gray");
    
    $(".stats-view-nav").css("margin-top", "5px");
    $(".stats-view-nav").css("margin-left", "5px");
    $(".stats-view-minpic").css("float", "left");
    $(".stats-view-textnav").css("float", "left");
    $(".stats-view-textnav").css("margin", "10px");
    
    var label = $(path).next("text").text();
    $(".stats-view-nav").append("<span>" + label + "</span>");
    console.log(label);
    switch (label) {
        case "Amigos Cercanos":
            setupData("closeFriends");
            break;
        case "Amigos Lejanos":
            setupData("farFriends");
            break;
        case "Amigos Interesantes":
            setupData("keyPeople");
            break;
        case "Líderes de Opinión":
            setupData("opinionLeaders");
            break;
    }
}

$("stats-view").on('mouseenter', '.stats-view-minpic', function () {
                   /*    var color = $(".stats-view-minpic").css("border-color");
                    color = color.replace(/[^0-9,]+/g, "");
                    var red = color.split(",")[0];
                    var gre = color.split(",")[1];
                    var blu = color.split(",")[2];
                    var light = Lighthen(red, gre, blu, 0.85);
                    $(".stats-view-minpic").css("border", "8px " + light + " solid"); */
                   //$(this).css("box-shadow", "inset 0px 0px 15px #fff");
                   $(this).next().css("text-decoration", "underline");
                   $(this).next().css("cursor", "pointer");
                   $(".stats-view-minpic").addClass("animated pulse");
                   });

$("stats-view").on('mouseleave', '.stats-view-textnav', function () {
                   /*  var color = $(".stats-view-minpic").css("border-color");
                    color = color.replace(/[^0-9,]+/g, "");
                    var red = color.split(",")[0];
                    var gre = color.split(",")[1];
                    var blu = color.split(",")[2];
                    var dark = Darken(red, gre, blu, 0.85);
                    $(".stats-view-minpic").css("border", "8px " + dark + " solid"); */
                   //$(".stats-view-minpic").css("box-shadow", "none");
                   $(this).css("text-decoration", "none");
                   $(".stats-view-minpic").removeClass("animated pulse");
                   });

$("stats-view").on('mouseenter', '.stats-view-textnav', function () {
                   /*   var color = $(".stats-view-minpic").css("border-color");
                    color = color.replace(/[^0-9,]+/g, "");
                    var red = color.split(",")[0];
                    var gre = color.split(",")[1];
                    var blu = color.split(",")[2];
                    var light = Lighthen(red, gre, blu, 0.85);
                    $(".stats-view-minpic").css("border", "8px " + light + " solid");*/
                   //$(".stats-view-minpic").css("box-shadow", "inset 0px 0px 10px #fff");
                   $(this).css("text-decoration", "underline");
                   $(this).css("cursor", "pointer");
                   $(".stats-view-minpic").addClass("animated pulse");
                   });

$("stats-view").on('mouseleave', '.stats-view-minpic', function () {
                   $(".stats-view-minpic").removeClass("animated pulse");
                   /*var color = $(".stats-view-minpic").css("border-color");
                    color = color.replace(/[^0-9,]+/g, "");
                    var red = color.split(",")[0];
                    var gre = color.split(",")[1];
                    var blu = color.split(",")[2];
                    var dark = Darken(red, gre, blu, 0.85);
                    $(".stats-view-minpic").css("border", "8px " + dark + " solid"); */
                   //$(this).css("box-shadow", "none");
                   $(this).next().css("text-decoration", "none");
                   $(".stats-view-minpic").removeClass("animated pulse");
                   });

$("stats-view").on('click', '.stats-view-minpic', function () {
                   $(".stats-view-graphic").css("display", "block");
                   $(".stats-view-box").css("display", "block");
                   $(".stats-view-list").remove();
                   $(".stats-view-minbox").remove();
                   $(".stats-view-nav").remove();
                   });

$("stats-view").on('click', '.stats-view-textnav', function () {
                   $(".stats-view-graphic").css("display", "block");
                   $(".stats-view-box").css("display", "block");
                   $(".stats-view-list").remove();
                   $(".stats-view-minbox").remove();
                   $(".stats-view-nav").remove();
                   });

function setupData(datashow) {
    var items = [];
    var dataset;
    var background;
    switch (datashow) {
        case "keyPeople":
            dataset = json.userLocalStats.localNetwork.keyPeople;
            break;
        case "opinionLeaders":
            dataset = json.userLocalStats.localNetwork.opinionLeaders;
            break;
        case "farFriends":
            dataset = json.userLocalStats.localNetwork.opinionLeaders;
            break;
        case "closeFriends":
            dataset = json.userLocalStats.localNetwork.closeFriends;
            break;
    }
    console.log(dataset[0]);
    $.each(dataset, function (key, value) {
           background = "url(" + this.picture + ") no-repeat center center";
           var tags = this.tags.split(",");
           var i=0;
           items.push("<div class=\"sl-inbox\">");
           items.push("<div class=\"inbox-id\">" + this.guid + "</div>");
           items.push("<div class=\"inbox-img\" style=\"background:" + background + "\"></div>");
           items.push("<div class=\"inbox-meta\">");
           items.push("<div class=\"inbox-lead\">" + this.name + "</div>");
           items.push("<div class=\"inbox-sub\">" + this.location + "</div></div>");
           /*
            items.push("<div class=\"inbox-action\">");
            items.push("<button class=\"inbox-action-button\"");
            items.push("value=" + this.guid + ">Mensaje</button></div>");
            */
           items.push("<div class=\"stats-view-float\">");
           items.push("<div class=\"stats-view-float-title\">Gustos e Intereses</div>");
           tags.forEach(function(entry) {
                        items.push("<div class=\"stats-view-float-tag\">"+tags[i++]+"</div>");
                        });
           items.push("</div></div>");
           });
    $("<div/>", {
      "class": "stats-view-list",
      html: items.join("")
      }).appendTo(".stats-view-container");
}

$("stats-view").on('mouseenter', '.sl-inbox', function () {
                   var colorSet = $(".stats-view-minpic").css("border-color");
                   if(colorSet == "rgb(255, 235, 7)") {
                   $(".stats-view-float-tag").css("color","#45484c");        
                   }
                   $(".stats-view-float-tag").css("background",colorSet);
                   //$(this).find(".inbox-img").css("box-shadow", "inset 0px 0px 15px #fff");
                   $(this).css("cursor", "pointer");
                   $(this).find(".inbox-img").addClass("animated pulse");
                   $(this).find(".stats-view-float").css("visibility","visible");
                   $(this).find(".stats-view-float").addClass("animated fadeInRight");
                   });

$("stats-view").on('mouseleave', '.sl-inbox', function () {
                   //$(this).find(".inbox-img").css("box-shadow", "none");
                   $(this).css("text-decoration", "none");
                   $(this).find(".inbox-img").removeClass("animated pulse");
                   $(this).find(".stats-view-float").removeClass("animated fadeInRight");
                   $(this).find(".stats-view-float").css("visibility","hidden");
                   //$(this).find(".stats-view-float").remove();
                   });