import { Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { Wei, wei } from "@synthetixio/wei";
import { currency } from "../../utils/currency";

export function Amount({
  value,
  prefix = "",
  suffix = "",
  onClick = () => {},
}: {
  prefix?: string;
  value?: Wei;
  suffix?: string;
  onClick?: (preciseValue: string) => void;
}) {
  const { formattedValue, preciseValue } = useMemo(() => {
    if (!value) {
      return { formattedValue: "-", preciseValue: "-" };
    }
    const formattedValue = currency(value);
    const cleanNumber = wei(formattedValue.replaceAll(",", ""));
    return {
      formattedValue,
      preciseValue: value.eq(cleanNumber) ? formattedValue : value.toString(),
    };
  }, [value]);

  return (
    <Tooltip
      label={
        <>
          {prefix}&nbsp;
          {preciseValue}&nbsp;
          {suffix}
        </>
      }
      isDisabled={formattedValue === preciseValue}
    >
      <Text
        _hover={
          !!onClick
            ? {
                cursor: "pointer",
                color: "cyan",
                textDecoration: "underline",
              }
            : {}
        }
        onClick={() => onClick(preciseValue)}
      >
        {prefix ? `${prefix} ` : ""}
        {formattedValue}&nbsp;
        {suffix}
      </Text>
    </Tooltip>
  );
}
