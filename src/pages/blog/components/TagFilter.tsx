import * as React from 'react';
import {Theme, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {ETagIcon} from "../../../services/TagsService";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function TagFilter(props: any) {
    const tags = props.tags;
    const onChange: any = props.onChange;

    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: {value},
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div>
            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel id="tag-label">Tags</InputLabel>
                <Select
                    labelId="tag-label"
                    id="tag"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected !== undefined && selected.map((tagName: string) => {
                                const tag = tags.find((tag: any) => tag.name === tagName);
                                //console.log('selected tag ', tag)
                                const id = tag.id;
                                const name = tag.name;
                                const eTagIcon = ETagIcon.getIconByName(tag.icon);
                                var Icon = null;
                                if (eTagIcon) {
                                    Icon = eTagIcon.getIcon();
                                } else Icon = null;
                                if (Icon)
                                    return (
                                        <Chip key={"tag-" + id} label={name} avatar={<Icon/>}/>
                                    )
                                else return (
                                    <Chip key={"tag-" + id} label={name}/>
                                )
                            })}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {tags.map((tag: any) => {
                        const id = tag.id;
                        const name = tag.name;
                        return (
                            <MenuItem
                                key={id}
                                value={name}
                                style={getStyles(name, personName, theme)}
                            >
                                {name}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );

}
