import { Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { Wei, wei } from "@synthetixio/wei";
import { currency } from "../../utils/currency";

export function Amount({
  value,
  prefix = "",
  suffix = "",
}: {
  prefix?: string;
  value?: Wei;
  suffix?: string;
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
      <span>
        {prefix}&nbsp;
        {formattedValue}&nbsp;
        {suffix}
      </span>
    </Tooltip>
  );
}
