import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import cache from "memory-cache"

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
                    <ListItemButton href={"/blog"}>
                        <ListItemIcon><BookIcon/></ListItemIcon>
                        <ListItemText primary={'Blogs'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={'clearCache'} disablePadding>
                    <ListItemButton onClick={() => {
                        Swal.fire({
                            title: 'Are you sure',
                            text: "You want to clear the cache?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, clear it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                cache.clear();
                                Swal.fire(
                                    'Cleared!',
                                    'The cache has been cleared.',
                                    'success'
                                )
                            }
                        });
                    }}>
                        <ListItemIcon><DeleteIcon/></ListItemIcon>
                        <ListItemText primary={'Clear Frontend Cache'}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    useEffect(() => {
        // add keypress listener for the 'q + ctrl' key, and call toggleDrawer when it's pressed and only if the user is not typing in an input
        if (typeof document !== 'undefined') {
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
        }
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
