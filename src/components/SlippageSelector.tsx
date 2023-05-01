import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

export function SlippageSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Box pb={2} width="100%">
      <Slider min={0} max={10} aria-label="slider-ex-6" onChange={onChange}>
        <SliderMark value={3} {...labelStyles}>
          3%
        </SliderMark>
        <SliderMark value={5} {...labelStyles}>
          5%
        </SliderMark>
        <SliderMark value={10} {...labelStyles}>
          10%
        </SliderMark>

        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}
