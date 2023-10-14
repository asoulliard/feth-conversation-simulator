import { useState } from "react";
import { portraitMeta } from "../meta/portrait";
import { glyphMeta } from "../meta/glyph";
import { createCanvas, loadImage, trim, getImageUrl } from "../utils";

import Canvas from "./Canvas";
import Form from "./Form";

const GLYPH_W = 48;
const GLYPH_H = 52;
const GLYPH_OUT_W = 40;
const GLYPH_OUT_H = 44;
const GLYPH_NAME_MARGIN = 1;
const GLYPH_TEXT_MARGIN = 0;
const SPACE_SIZE = 10;
const NAME_POS_X_START = 100;
const NAME_POS_X_END = 495;
const NAME_POS_Y = 228;
const TEXT_POS_X = 300;
const TEXT_POS_Y = 308;
const MAX_TEXT_ROW = 3;
const DEFAULT_CHARACTER = "Anna";

const initialPortraits = Object.keys(portraitMeta);
const initialEmotions = [...Array(portraitMeta[DEFAULT_CHARACTER]).keys()];
const initialText = "Welcome!";

export default function App({ resources }) {
  const [emotions, setEmotions] = useState(initialEmotions);
  const [name, setName] = useState(DEFAULT_CHARACTER);
  const [emotion, setEmotion] = useState(initialEmotions[0]);
  const [portrait, setPortrait] = useState(DEFAULT_CHARACTER);
  const [text, setText] = useState(initialText);
  const [globalCanvas, setGlobalCanvas] = useState(null);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handlePortraitChange(e) {
    setPortrait(e.target.value);
    setEmotions([...Array(portraitMeta[e.target.value]).keys()]);
  }

  function handleEmotionChange(e) {
    setEmotion(e.target.value);
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleDownload(e) {
    e.target.download = `${name}.png`;
    e.target.href = globalCanvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  }

  function handleCanvas(canvas) {
    setGlobalCanvas(canvas);
  }

  function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function drawTextBox(context) {
    context.drawImage(resources[0], 0, 0);
  }

  function drawName(context) {
    // If name is empty, not draw
    if (name == "") return;

    // Initialize word
    const word = [];

    for (let i = 0; i < name.length; i++) {
      // If letter eq space, then push space in word
      if (name[i] == " ") {
        word.push(createCanvas(SPACE_SIZE, GLYPH_H)[0]);
        continue;
      }

      // Initialize empty canvas and meta
      const [canvas, ctx] = createCanvas(GLYPH_W, GLYPH_H);
      const meta = glyphMeta[name[i]];

      // If glyph not found
      if (meta == undefined) {
        //this.name_error = "Unknown glyph. See glyph_meta.json";
        return;
      }

      // Clear error
      //this.name_error = "";

      // Drawing letter in empty canvas
      ctx.drawImage(
        resources[1],
        meta[0] * GLYPH_W,
        meta[1] * GLYPH_H,
        GLYPH_W,
        GLYPH_H,
        0,
        0,
        GLYPH_OUT_W,
        GLYPH_OUT_H
      );

      // Push trim letter in word
      word.push(trim(canvas));
    }

    // Get word width and get x pos of centered name
    const width = word
      .map((letter) => letter.width)
      .reduce((total, width) => (total += width));
    let posX =
      (NAME_POS_X_END - NAME_POS_X_START - width) / 2 + NAME_POS_X_START;

    // Drawing word
    for (const letter of word) {
      context.drawImage(letter, posX, NAME_POS_Y);
      posX += letter.width + GLYPH_NAME_MARGIN;
    }
  }

  function drawText(context) {
    // If text is empty, not draw
    if (text == "") return;

    // Initialize text positions
    let posX = TEXT_POS_X;
    let posY = TEXT_POS_Y;

    for (let i = 0; i < text.length; i++) {
      // If letter eq new line, then change pos
      if (text[i] == "\n") {
        posX = TEXT_POS_X;
        posY += GLYPH_H;
        continue;
      }

      // If letter eq space, then change x pos
      if (text[i] == " ") {
        posX += SPACE_SIZE;
        continue;
      }

      const [canvas, ctx] = createCanvas(GLYPH_W, GLYPH_H);
      const meta = glyphMeta[text[i]];

      // If glyph not found
      if (meta == undefined) {
        //this.text_error = "Unknown glyph. See glyph_meta.json";
        return;
      }

      // Clear error
      //this.text_error = "";

      // Drawing letter in empty canvas
      ctx.drawImage(
        resources[2],
        meta[0] * GLYPH_W,
        meta[1] * GLYPH_H,
        GLYPH_W,
        GLYPH_H,
        0,
        0,
        GLYPH_W,
        GLYPH_H
      );

      const trimmedCanvas = trim(canvas);

      // Drawing letter
      context.drawImage(trimmedCanvas, posX, posY);
      posX += trimmedCanvas.width + GLYPH_TEXT_MARGIN;
    }
  }

  async function drawPortrait(context) {
    const portraitImage = await loadImage(
      getImageUrl(`/images/portraits/${portrait}/${emotion}.png`)
    );

    const [canvas, ctx] = createCanvas(
      portraitImage.width,
      portraitImage.height
    );

    // Drawing portrait and mask
    ctx.drawImage(resources[3], 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(portraitImage, 0, 0);

    context.drawImage(canvas, 1200, 0);
  }

  async function handleDraw(context) {
    clearCanvas(context);
    drawTextBox(context);
    await drawPortrait(context);
    drawName(context);
    drawText(context);
  }

  return (
    <div className="container mt-4 app">
      <div className="form-group">
        <Canvas
          name={name}
          portrait={portrait}
          emotion={emotion}
          text={text}
          onDraw={handleDraw}
          onCanvas={handleCanvas}
        />
      </div>
      <Form
        name={name}
        portrait={portrait}
        emotion={emotion}
        text={text}
        portraits={initialPortraits}
        emotions={emotions}
        onNameChange={handleNameChange}
        onPortraitChange={handlePortraitChange}
        onEmotionChange={handleEmotionChange}
        onTextChange={handleTextChange}
        onDownload={handleDownload}
      />
      <p className="text-center text-muted">
        <strong>v1.0.5</strong> by{" "}
        <a target="_blank" href="https://github.com/bqio">
          bqio
        </a>
        , thx{" "}
        <a target="_blank" href="https://github.com/SinsofSloth">
          {" "}
          SinsofSloth
        </a>
        ,{" "}
        <a
          target="_blank"
          href="https://github.com/bqio/FE3H-Text-Simulator/blob/master/README.md"
        >
          {" "}
          Changelog{" "}
        </a>
      </p>
    </div>
  );
}
