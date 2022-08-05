import React, {
  createRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import "./canvas.css";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { IndividualSticker } from "./individualSticker";
import { useSelector, useDispatch } from "react-redux";
import { deleteStickerOnPanel } from "../../../modules/sticker";
import { deleteImageOnPanel } from "../../../modules/image";

export default function Canvas({ type, paper, setPaper }) {
  // 다이어리 요소들 조회하는 api 요청을 Canvas 내부에서 보내기.

  const dispatch = useDispatch();
  const stickers = useSelector((state) => state.sticker);
  const images = useSelector((state) => state.image);
  const [selectedId, selectShape] = React.useState(null);
  const [background] = useImage(paper.src); // 속지

  // 빈 땅 클릭했을때 포커스 해제
  const checkDeselect = (e) => {
    console.log(e.target);

    const clickedOnEmpty = e.target.attrs.id == "backgroundImage"; // 배경을 클릭했다면

    if (clickedOnEmpty) selectShape(null);
  };
  console.log(stickers);
  return (
    <div style={{ width: "100%", height: "674rem" }}>
      <Stage
        width={945}
        height={674 * 0.9}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          <KonvaImage
            image={background}
            id="backgroundImage"
            width={1380 * 0.8}
            height={674 * 0.9}
          />
          {stickers &&
            stickers.map((sticker, i) => {
              return (
                <IndividualSticker
                  key={i}
                  onDelete={() => dispatch(deleteStickerOnPanel(i))}
                  onDragEnd={(event) => {
                    sticker.x = event.target.x();
                    sticker.y = event.target.y();
                  }}
                  isSelected={sticker.id === selectedId}
                  image={sticker}
                  onSelect={() => {
                    selectShape(sticker.id);
                  }}
                  onChange={(newAttrs) => {
                    // 변경된 크기값으로 적용
                    dispatch(changeSticker(i, newAttrs));
                  }}
                />
              );
            })}

          {images &&
            images.map((image, i) => {
              return (
                <IndividualSticker
                  onDelete={() => dispatch(deleteImageOnPanel(i))}
                  onDragEnd={(event) => {
                    image.x = event.target.x();
                    image.y = event.target.y();
                  }}
                  key={i}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={() => {
                    selectShape(image.id);
                  }}
                  onChange={(newAttrs) => {
                    // 변경된 크기값으로 적용
                    dispatch(changeImage(i, newAttrs));
                  }}
                />
              );
            })}

          {/**텍스트추가 */}
        </Layer>
      </Stage>
    </div>
  );
}
