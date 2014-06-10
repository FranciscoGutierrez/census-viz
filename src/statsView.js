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

var jsonData = $("stats-view").attr("data");

var data = [{
            "age": "Amigos Interesantes",
            "population": 1200
            }, {
            "age": "Líderes de Opinión",
            "population": 200
            }, {
            "age": "Amigos Lejanos",
            "population": 700
            }, {
            "age": "Amigos Cercanos",
            "population": 500
            }]

var width = 350,
height = 250,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
.range(["#ff7686", "#ffeb07", "#20dd64", "#48a4ff"]);

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

var g = svg.selectAll(".arc")
.data(pie(data))
.enter().append("g")
.attr("class", "arc");

g.append("path")
.attr("d", arc)
.style("fill", function (d) {
       return color(d.data.age);
       });

g.append("text")
.attr("class", "label")
.attr("transform", function (d) {
      var dist = radius - 20;
      angle = (d.startAngle + d.endAngle) / 2; // Middle of wedge
      x = dist * Math.sin(angle);
      y = -dist * Math.cos(angle);
      var rotate = rotateText(d.startAngle, d.endAngle);
      return "translate(" + x + "," + y + ")";
      })
.attr("dy", "0.35em")
.attr("text-anchor", "middle")
.text(function (d) {
      return d.data.age;
      });

g.append("text")
.attr("class", "label-meta")
.attr("transform", function (d) {
      var dist = radius - 20;
      angle = (d.startAngle + d.endAngle) / 2;
      x = dist * Math.sin(angle);
      y = -dist * Math.cos(angle);
      var rotate = rotateText(d.startAngle, d.endAngle);
      return "translate(" + x + "," + y + ")";
      })
.attr("dy", "1.75em")
.attr("text-anchor", "middle")
.text(function (d) {
      return d.data.population.toLocaleString() + " Amigos";
      });

/*Events and stuff */
$(document).ready(function () {
                  $(".stats-view-box").css("visibility", "hidden");
                  $("path").next().fadeOut(1200);
                  $("path").next().next().fadeOut(1200, function () {
                                                  $(".stats-view-box").css("visibility", "visible");
                                                  $(".stats-view-box").addClass("animated slideInDown");
                                                  });
                  });

$("path").mouseenter(function () {
                     var color = $(this).css("fill");
                     $(this).next().fadeIn("fast");
                     $(this).next().next().fadeIn("fast");
                     color = color.replace(/[^0-9,]+/g, "");
                     var red = color.split(",")[0];
                     var gre = color.split(",")[1];
                     var blu = color.split(",")[2];
                     $(this).css("fill", Lighthen(red, gre, blu));
                     $(this).css("cursor", "pointer");
                     });

$("path").mouseleave(function () {
                     var color = $(this).css("fill");
                     $(this).next().fadeOut("fast");
                     $(this).next().next().fadeOut("fast");
                     color = color.replace(/[^0-9,]+/g, "");
                     var red = color.split(",")[0];
                     var gre = color.split(",")[1];
                     var blu = color.split(",")[2];
                     $(this).css("fill", Darken(red, gre, blu));
                     $(this).css("fill-opacity", "1");
                     });

$("stats-view").click(function () {
                      var color = $(this).css("fill");
                      $(".label").fadeIn(900, function () {
                                         $(".label").fadeOut(900);
                                         });
                      $(".label-meta").fadeIn(900, function () {
                                              $(".label-meta").fadeOut(900);
                                              });
                      
                      });

function Lighthen(red, green, blue) {
    var multiplier = .95;
    var r = Math.round(red * multiplier);
    var g = Math.round(green * multiplier);
    var b = Math.round(blue * multiplier);
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return "rgb(" + r + "," + g + "," + b + ")";
}

function Darken(red, green, blue) {
    var multiplier = .95;
    var r = Math.round(red / multiplier);
    var g = Math.round(green / multiplier);
    var b = Math.round(blue / multiplier);
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return "rgb(" + r + "," + g + "," + b + ")";
}

function rotateText(start, end) {
    return (start + end) / 2 * (180 / Math.PI);
}