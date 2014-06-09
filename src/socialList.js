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
/* Social List Component.
 * Universidad de las Américas Puebla http://ict.udlap.mx
 * As part of REAUMOBILE project.
 * Author: Francisco Gutiérrez (fsalvador23@gmail.com)
 */

document.registerElement('social-list', {
                         prototype: Object.create(HTMLElement.prototype)
                         });
var prefix = "census";
var jsonData = $("social-list").attr("data");
var sLeftTab = "< Personas Interesantes";
var scenterTab = "Personas que quizás conozcas";
var srightTab = "Líderes de Opinión >";
var imgsrc = "";
var actionbutton1 = "";
var actionbutton2 = "";
/* Layout Make */
$("social-list").append("<div class=\"container\"></div>");
$(".container").append("<div class=\"tab-bar\"></div>");
$(".tab-bar").append("<div class=\"left-tab\">" + sLeftTab + "</div>");
$(".tab-bar").append("<div class=\"center-tab\">" + scenterTab + "</div>");
$(".tab-bar").append("<div class=\"right-tab\">" + srightTab + "</div>");

setupData("mayKnow");

function setupData(datashow) {
    $.getJSON(jsonData, function (data) {
              var items = [];
              var dataset;
              switch (datashow) {
              case "keyPeople":
              dataset = data.keyPeople;
              break;
              case "opinionLeaders":
              dataset = data.opinionLeaders;
              break;
              case "peopleAway":
              dataset = data.peopleAway;
              break;
              case "mayKnow":
              dataset = data.mayKnow;
              break;
              case "shouldKnow":
              dataset = data.shouldKnow;
              break;
              }
              $.each(dataset, function (key, value) {
                     items.push("<div class=\"box\">");
                     items.push("<div class=\"hidden-id\"" + this.guid + "</div>");
                     items.push("<div class=\"img-box\"><img src=" + this.picture + "/></div>");
                     items.push("<div class=\"metadata-box\">");
                     items.push("<div class=\"lead-meta\">" + this.name + "</div>");
                     // items.push("<div class=\"\">"+ this.company + "</div>");
                     items.push("<div class=\"sub-meta\">" + this.location + "</div></div>");
                     items.push("<div class=\"action-box\">");
                     items.push("<button class=\"first-action\"");
                     items.push("value=" + this.guid + ">Agregar</button>");
                     items.push("<button class=\"second-action\"");
                     items.push("value=" + this.guid + ">Mensaje</button></div>");
                     items.push("</div></div>");
                     });
              $("<div/>", {
                "class": "box-container",
                html: items.join("")
                }).appendTo(".container");
              });
}
/* Event Handler*/
$(".left-tab").click(function () {
                     $(".box-container").fadeOut(100, function () {
                                                 $(this).remove();
                                                 if ($("div.center-tab").text() == "Personas que quizás conozcas") {
                                                 $("div.right-tab").text("Personas que quizá conozcas >");
                                                 $("div.center-tab").text("Personas Interesantes");
                                                 $("div.left-tab").text("");
                                                 setupData("keyPeople");
                                                 } else if ($("div.center-tab").text() == "Líderes de Opinión") {
                                                 $("div.right-tab").text(srightTab);
                                                 $("div.center-tab").text(scenterTab);
                                                 $("div.left-tab").text(sLeftTab);
                                                 setupData("mayKnow");
                                                 }
                                                 });
                     });

$(".right-tab").click(function () {
                      $(".box-container").fadeOut(100, function () {
                                                  $(this).remove();
                                                  if ($("div.center-tab").text() == "Personas que quizás conozcas") {
                                                  $("div.right-tab").text("");
                                                  $("div.center-tab").text("Líderes de Opinión");
                                                  $("div.left-tab").text("< Personas que quizá conozcas");
                                                  setupData("opinionLeaders");
                                                  } else if ($("div.center-tab").text() == "Personas Interesantes") {
                                                  $("div.right-tab").text(srightTab);
                                                  $("div.center-tab").text(scenterTab);
                                                  $("div.left-tab").text(sLeftTab);
                                                  setupData("mayKnow");
                                                  }
                                                  });
                      });

$(".container").on("click", ".first-action", function () {
                   eval($("social-list").attr("action1"));
                   });

$(".container").on("click", ".second-action", function () {
                   eval($("social-list").attr("action2"));
                   });