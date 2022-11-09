import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useEffect} from "react";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';

export default function SwipeableTemporaryDrawer() {
    const [state, setState] = React.useState(false);

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState(open);
            };

const list = () => (
    <Box
        sx={{width: 250}}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
    >
        <List>
            <ListItem key={'tagsIcon'} disablePadding>
                <ListItemButton href={"/admin/tags"}>
                    <ListItemIcon><LocalOfferIcon/></ListItemIcon>
                    <ListItemText primary={'Tags'}/>
                </ListItemButton>
            </ListItem>
            <ListItem key={'blogsIcon'} disablePadding>
                <ListItemButton href={"/blogs"}>
                    <ListItemIcon><BookIcon/></ListItemIcon>
                    <ListItemText primary={'Blogs'}/>
                </ListItemButton>
            </ListItem>
        </List>
    </Box>
);

useEffect(()=> {
    // add keypress listener for the 'q + ctrl' key, and call toggleDrawer when it's pressed and only if the user is not typing in an input
    document.addEventListener('keydown', (e) => {
        if (e.key === 'q' && e.ctrlKey &&
            !(e.target instanceof HTMLInputElement) &&
            !(e.target instanceof HTMLTextAreaElement) &&
            !(e.target instanceof HTMLSelectElement) &&
            !(e.target instanceof HTMLButtonElement)
        ) {
            // @ts-ignore
            toggleDrawer(true)(e);
        }
    });
})

return (
    <>
        {/*
            <Button onClick={toggleDrawer(true)}>Open</Button>
            */}
        <SwipeableDrawer
            anchor={'right'}
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            {list()}
        </SwipeableDrawer>
    </>
);
}
