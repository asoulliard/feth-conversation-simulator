import { useState } from "react";
import { portraitMeta } from "../meta/portrait";
import { glyphMeta } from "../meta/glyph";
import { createCanvas, loadImage, trim, getImageUrl, wait } from "../utils";

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
const DEFAULT_COLOR = "Purple";

const initialPortraits = Object.keys(portraitMeta);
const initialEmotions = [...Array(portraitMeta[DEFAULT_CHARACTER]).keys()];
const initialColors = ["Purple", "Red"];
const initialText = "Welcome!";

export default function App({ resources }) {
  const [emotions, setEmotions] = useState(initialEmotions);
  const [name, setName] = useState(DEFAULT_CHARACTER);
  const [emotion, setEmotion] = useState(initialEmotions[0]);
  const [portrait, setPortrait] = useState(DEFAULT_CHARACTER);
  const [reversePortrait, setReversePortrait] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [reverseFrame, setReverseFrame] = useState(false);
  const [text, setText] = useState(initialText);
  const [globalCanvas, setGlobalCanvas] = useState(null);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handlePortraitChange(e) {
    setEmotion(0);
    setPortrait(e.target.value);
    setEmotions([...Array(portraitMeta[e.target.value]).keys()]);
  }

  function handleReversePortraitChange(e) {
    setReversePortrait(e.target.checked);
  }

  function handleEmotionChange(e) {
    setEmotion(e.target.value);
  }

  function handleColorChange(e) {
    setColor(e.target.value);
  }

  function handleReverseFrameChange(e) {
    setReverseFrame(e.target.checked);
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleDownload(e) {
    e.target.download = "Dialogue.png";
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

  function drawTextBox(context, textboxImage) {
    context.save();
    context.scale(reverseFrame ? -1 : 1, 1);
    context.translate(reverseFrame ? (-1 * textboxImage.width) : 0, 0);
    context.drawImage(textboxImage, 0, 0);
    context.restore();
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
        resources[0],
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
        resources[1],
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

  function drawPortrait(context, portraitImage) {
    const [canvas, ctx] = createCanvas(
      portraitImage.width,
      portraitImage.height
    );

    // Drawing portrait and mask
    ctx.save();
    ctx.scale(reverseFrame ? -1 : 1, 1);
    ctx.translate(reverseFrame ? (-1 * portraitImage.width) : 0, 0);
    ctx.drawImage(resources[2], 0, 0);
    ctx.restore();
    
    ctx.globalCompositeOperation = "source-in";
    ctx.save();
    ctx.scale(reversePortrait ? -1 : 1, 1);
    ctx.translate(reversePortrait ? (-1 * portraitImage.width) : 0, 0);
    ctx.drawImage(portraitImage, 0, 0);

    context.drawImage(canvas, reverseFrame ? 16 : 1200, 0);
    ctx.restore();
  }

  function drawPlaceholder(context) {
    context.font = "48px arial";
    context.fillText("Rendering...", 750, 250);
  }

  async function handleDraw(context) {
    clearCanvas(context);
    drawPlaceholder(context);
    const portraitImage = await loadImage(
      getImageUrl(`/images/portraits/${portrait}/${emotion}.png`)
    );
    const textboxImage = await loadImage(
      getImageUrl(`/images/textboxes/${color}.png`)
    );
    clearCanvas(context);
    drawTextBox(context, textboxImage);
    drawPortrait(context, portraitImage);
    drawName(context);
    drawText(context);
  }

  return (
    <div className="container mt-4 app">
      <div className="form-group">
        <Canvas
          name={name}
          portrait={portrait}
          reversePortrait={reversePortrait}
          emotion={emotion}
          color={color}
          reverseFrame={reverseFrame}
          text={text}
          onDraw={handleDraw}
          onCanvas={handleCanvas}
        />
      </div>
      <Form
        name={name}
        portrait={portrait}
        reversePortrait={reversePortrait}
        emotion={emotion}
        color={color}
        reverseFrame={reverseFrame}
        text={text}
        portraits={initialPortraits}
        emotions={emotions}
        colors={initialColors}
        onNameChange={handleNameChange}
        onPortraitChange={handlePortraitChange}
        onReversePortraitChange={handleReversePortraitChange}
        onEmotionChange={handleEmotionChange}
        onColorChange={handleColorChange}
        onReverseFrameChange={handleReverseFrameChange}
        onTextChange={handleTextChange}
        onDownload={handleDownload}
      />
      <p className="text-center text-muted">
        <strong>v1.0.6</strong> by{" "}
        <a target="_blank" href="https://github.com/asoulliard">
          asoulliard
        </a>
        , forked from{" "}
        <a target="_blank" href="https://github.com/bqio">
          bqio
        </a>
      </p>
      <p className="text-center text-muted">
        <a
          target="_blank"
          href="https://github.com/asoulliard/FE3H-Text-Simulator/blob/master/README.md"
        >
          {" "}
          Changelog{" "}
        </a>
      </p>
    </div>
  );
}
