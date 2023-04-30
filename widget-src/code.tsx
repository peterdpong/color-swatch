import { ntc, ntcResult } from "./ntc";

const { widget } = figma
const { useSyncedState, AutoLayout, Rectangle, Text, Input } = widget

function getRandomHex() {
  // Hacky solution to obtain random number since Math.Random is restricted
  return Math.floor(((Date.now() * 16807 % 2147483647) / 2147483647) * 16777215).toString(16);
}

function Widget() {
  const NTC: ntc = new ntc();
  const [overrideName, setOverrideName] = useSyncedState('overrideName', "");
  const [hexCode, setHexcode] = useSyncedState('hexcode', '#' + getRandomHex())

  let colorMatch: ntcResult | undefined = NTC.getNameFromHexCode(hexCode.substring(1));

  if(colorMatch === undefined) {
    let randomHex = "#FF9B71"
    colorMatch = NTC.getNameFromHexCode(randomHex.substring(1));
    colorMatch!.colorName = "Invalid Hex Code!"
  }

  return (
    <AutoLayout
      verticalAlignItems={'start'}
      direction={'vertical'}
      fill={'#FFFFFF'}
      stroke={'#1c1c1c'}
      strokeWidth={2}
      strokeAlign={'inside'}
      cornerRadius={4}
    > 
      <Rectangle
        width={162}
        height={150}
        fill={hexCode}
      />
      <Rectangle
        width={162}
        height={2}
        fill={'#1c1c1c'}
      />

      <AutoLayout verticalAlignItems={'center'} direction={'vertical'} padding={{top: 2, bottom: 2, left: 4, right: 4}} spacing={1}>
      <Input
            value={overrideName.length !== 0 ? overrideName : colorMatch!.colorName}
            fontSize={15}
            width={156}
            inputFrameProps={{
              stroke: "#ffffff",
              cornerRadius: 2,
              padding: 1.5,
              hoverStyle: {stroke: '#1c1c1c'}
            }}
            inputBehavior={'truncate'}
            onTextEditEnd={(input: TextEditEvent) => {
              if(input.characters.length === 0) {
                // Reset name
                setOverrideName("");
              } else {
                setOverrideName(input.characters)
              }
            }}
          /> 
        

        <Input
          value={hexCode.toLocaleUpperCase()}
          fontSize={15}
          width={156}
          inputFrameProps={{
            stroke: "#ffffff",
            cornerRadius: 2,
            padding: 1.5,
            hoverStyle: {stroke: '#1c1c1c'}
          }}
          onTextEditEnd={(input: TextEditEvent) => {
            setHexcode(input.characters)
            setOverrideName("")
          }}
          />

        <Text fontSize={15}>{`R: ${colorMatch!.rgb[0]} G: ${colorMatch!.rgb[1]} B: ${colorMatch!.rgb[2]}`}</Text>
      </AutoLayout>

    </AutoLayout>
  )
}

widget.register(Widget)
