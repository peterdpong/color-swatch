import { ntc, ntcResult } from "./ntc";

const { widget } = figma
const { useSyncedState, AutoLayout, Rectangle, Text, Input } = widget

function Widget() {
  const NTC: ntc = new ntc();
  const startColors = ['#FF9B71', '#9C89B8', '#FC6471', '#E9806E']
  const [overrideName, setOverrideName] = useSyncedState('overrideName', "");
  const [hexCode, setHexcode] = useSyncedState('hexcode', () => {
    return startColors[Math.floor(Math.random() * startColors.length)]
  })
  const [editName, setEditName] = useSyncedState('editName', false);
  const [editHex, setEditHex] = useSyncedState('editHex', false)

  let colorMatch: ntcResult | undefined = NTC.getNameFromHexCode(hexCode.substring(1));
  const editInputFrameProps = {
    fill: "#f5f5f5",
    stroke: "#808080",
    cornerRadius: 4,
    padding: 1,
  };

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
      strokeAlign={'outside'}
      cornerRadius={4}
      spacing={2}
    > 
      <Rectangle
        width={160}
        height={160}
        fill={colorMatch!.hexCode}
      />

      <AutoLayout verticalAlignItems={'center'} direction={'vertical'} padding={{left: 2, right: 2}} spacing={1}>
        {editName ? 
          <Input
            value={overrideName.length !== 0 ? overrideName : colorMatch!.colorName}
            fontSize={15}
            width={156}
            inputBehavior={'truncate'}
            inputFrameProps={editInputFrameProps}
            onTextEditEnd={(input: TextEditEvent) => {
              if(input.characters.length === 0) {
                // Reset name
                setOverrideName("");
              } else {
                setOverrideName(input.characters)
              }
              setEditName(false)
            }}
          /> : <AutoLayout padding={1}>
            <Text fontSize={15} hoverStyle={{fill: '#6b6b6b'}} onClick={() => {
              setEditName(true)
            }}>{overrideName.length !== 0 ? overrideName : colorMatch!.colorName}</Text>
          </AutoLayout>
        
        }

        {editHex ? <Input
          value={hexCode}
          fontSize={15}
          width={156}
          inputFrameProps={editInputFrameProps}
          onTextEditEnd={(input: TextEditEvent) => {
            setHexcode(input.characters)
            setOverrideName("")
            setEditHex(false)
          }}
          /> : <AutoLayout padding={1}>
            <Text fontSize={15} hoverStyle={{fill: '#6b6b6b'}} onClick={() => {
              setEditHex(true)
            }}>{hexCode}</Text>
          </AutoLayout>
        }

        <Text fontSize={15}>{`R: ${colorMatch!.rgb[0]} G: ${colorMatch!.rgb[1]} B: ${colorMatch!.rgb[2]}`}</Text>
      </AutoLayout>

    </AutoLayout>
  )
}

widget.register(Widget)
