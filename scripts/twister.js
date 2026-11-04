/**
 * AI Skunkworks — home hero "twister"
 * Three gadget skunks (smart goggles, LED collar, wrist watch, tail drone)
 * spiral up a spinning funnel of circuit rings. Pure SVG + requestAnimationFrame.
 */
(function () {
  "use strict";

  var svg = document.querySelector(".twister__svg");
  if (!svg) return;

  var NS = "http://www.w3.org/2000/svg";
  var backRings = svg.querySelector("[data-twister-back]");
  var frontRings = svg.querySelector("[data-twister-front]");
  var layerBack = svg.querySelector('[data-twister-layer="back"]');
  var layerFront = svg.querySelector('[data-twister-layer="front"]');
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Funnel geometry */
  var CX = 200;
  var BOTTOM = 336;
  var TOP = 56;
  var R_BOTTOM = 34;
  var R_TOP = 168;
  var RINGS = 9;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* Rings: back arc (top half) behind the skunks, front arc (bottom half) in front */
  for (var i = 0; i < RINGS; i++) {
    var p = i / (RINGS - 1);
    var y = lerp(BOTTOM, TOP, p);
    var rx = lerp(R_BOTTOM, R_TOP, Math.pow(p, 1.15));
    var ry = rx * 0.17;
    var cls = "twister__ring" + (i % 3 === 1 ? " twister__ring--accent" : "");
    var dur = (2.4 + i * 0.35).toFixed(2) + "s";

    var back = document.createElementNS(NS, "path");
    back.setAttribute("d", "M" + (CX - rx) + " " + y + " A" + rx + " " + ry + " 0 0 1 " + (CX + rx) + " " + y);
    back.setAttribute("class", cls + " twister__ring--back");
    back.style.animationDuration = dur;
    backRings.appendChild(back);

    var front = document.createElementNS(NS, "path");
    front.setAttribute("d", "M" + (CX + rx) + " " + y + " A" + rx + " " + ry + " 0 0 1 " + (CX - rx) + " " + y);
    front.setAttribute("class", cls);
    front.style.animationDuration = dur;
    frontRings.appendChild(front);
  }

  /* One skunk, facing right, feet at (22, 33) in local units */
  var SKUNK =
    '<g class="tk__body">' +
    '<g class="tk__tail">' +
    '<path class="tk__fur" d="M15 20 C8 20 3 15 3.5 9 C4 3.5 9.5 1 14 3 C10 5 8.5 9 10.5 13 C12 16 14.5 17.5 17 18.5 Z"/>' +
    '<path class="tk__stripe" d="M12.5 4.2 C9.5 7 9.4 11 11.8 14.6"/>' +
    /* tail drone: pod, antenna, spinning rotor, blinking light */
    '<g class="tk__drone">' +
    '<rect class="tk__pod" x="5.2" y="-0.6" width="6" height="3.6" rx="1.2"/>' +
    '<rect class="tk__pod-light" x="9.2" y="0.6" width="1.2" height="1.2" rx="0.3"/>' +
    '<path class="tk__mast" d="M8.2 -0.6 V-2.4"/>' +
    '<path class="tk__rotor" d="M4.6 -2.6 H11.8"/>' +
    "</g>" +
    "</g>" +
    '<g class="tk__leg tk__leg--a"><path class="tk__limb" d="M16.5 25 V32.5"/></g>' +
    '<g class="tk__leg tk__leg--b"><path class="tk__limb" d="M19.5 25.5 V32.5"/></g>' +
    '<g class="tk__leg tk__leg--b"><path class="tk__limb" d="M27 25.5 V32.5"/></g>' +
    /* front leg wears the watch */
    '<g class="tk__leg tk__leg--a"><path class="tk__limb" d="M30 25 V32.5"/>' +
    '<rect class="tk__watch-strap" x="28.3" y="28" width="3.4" height="2.4" rx="0.6"/>' +
    '<rect class="tk__watch-face" x="28.9" y="28.4" width="2.2" height="1.6" rx="0.4"/>' +
    "</g>" +
    '<g class="tk__bob">' +
    '<ellipse class="tk__fur" cx="23" cy="22" rx="10.5" ry="6"/>' +
    '<circle class="tk__fur" cx="34" cy="18.5" r="5"/>' +
    '<ellipse class="tk__fur" cx="38.6" cy="20.6" rx="3.6" ry="2.3"/>' +
    '<path class="tk__fur" d="M30.5 14.6 L31.4 10.2 L34 14 Z"/>' +
    '<path class="tk__stripe" d="M33 16.2 C28 16.6 23 17.4 15.2 20.2"/>' +
    /* smart collar with LEDs */
    '<path class="tk__collar" d="M29.6 15.6 C28.6 18 28.8 21 30.2 23.4"/>' +
    '<circle class="tk__collar-led" cx="29.1" cy="17.6" r="0.55"/>' +
    '<circle class="tk__collar-led tk__collar-led--2" cx="29" cy="19.6" r="0.55"/>' +
    '<circle class="tk__collar-led tk__collar-led--3" cx="29.4" cy="21.6" r="0.55"/>' +
    /* smart goggles */
    '<path class="tk__strap" d="M32.4 15.4 C31 15.8 30.4 17 30.6 18.4"/>' +
    '<rect class="tk__goggle" x="33.2" y="15.6" width="5" height="3.8" rx="1.6"/>' +
    '<rect class="tk__lens" x="34" y="16.3" width="3.4" height="2.4" rx="1"/>' +
    '<path class="tk__glint" d="M34.6 16.9 L35.6 16.9"/>' +
    '<circle class="tk__nose" cx="41.9" cy="20.4" r="1.05"/>' +
    "</g>" +
    "</g>";

  var skunks = [];
  for (var k = 0; k < 3; k++) {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "tk");
    g.innerHTML = SKUNK;
    g.style.setProperty("--tk-delay", (-k * 0.11).toFixed(2) + "s");
    layerFront.appendChild(g);
    skunks.push({ el: g, phase: (k / 3) * Math.PI * 2, lift: k / 3, layer: "front" });
  }

  var LAP = 3.4; /* seconds per orbit */
  var CLIMB = 10.5; /* seconds bottom → top */

  function place(s, t) {
    var theta = s.phase + (t / LAP) * Math.PI * 2;
    var p = (t / CLIMB + s.lift) % 1;
    var y = lerp(BOTTOM, TOP, p);
    var R = lerp(R_BOTTOM, R_TOP, Math.pow(p, 1.15)) * 0.82;
    var depth = Math.sin(theta); /* +1 = nearest the viewer */
    var x = CX + R * Math.cos(theta);
    y += depth * R * 0.17;

    /* moving left on the near side, right on the far side; squash through the turn */
    var face = Math.max(-1, Math.min(1, -depth * 2.2));
    if (Math.abs(face) < 0.18) face = face < 0 ? -0.18 : 0.18;

    var scale = (2.1 + p * 0.55) * (1 + depth * 0.14);
    var tilt = -face * 8 * p;
    var fade = Math.min(1, p * 7, (1 - p) * 7);

    s.el.setAttribute(
      "transform",
      "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + tilt.toFixed(2) + ") scale(" +
        (scale * face).toFixed(3) + " " + scale.toFixed(3) + ") translate(-22 -33)"
    );
    s.el.style.opacity = (fade * (0.88 + 0.12 * (depth + 1) / 2)).toFixed(3);

    var want = depth >= 0 ? "front" : "back";
    if (want !== s.layer) {
      (want === "front" ? layerFront : layerBack).appendChild(s.el);
      s.layer = want;
    }
  }

  var start = null;
  var raf = null;
  var offset = 0;

  function frame(now) {
    if (start === null) start = now - offset * 1000;
    var t = (now - start) / 1000;
    offset = t;
    skunks.forEach(function (s) {
      place(s, t);
    });
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (raf || reduce.matches) return;
    start = null;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function still() {
    /* Reduced motion: a frozen moment of the twister */
    pause();
    svg.classList.add("is-still");
    skunks.forEach(function (s) {
      place(s, 2.2);
    });
  }

  if (reduce.matches) {
    still();
  } else {
    place(skunks[0], 0);
    play();
  }

  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      still();
    } else {
      svg.classList.remove("is-still");
      play();
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) play();
        else pause();
      });
    }).observe(svg);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
    else play();
  });
})();
