import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {useEffect} from "react";

function not(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
    return [...a, ...not(b, a)];
}

export default function TagsList(props: any) {
    const selectedTags = props.selectedTags;
    const availableTags = props.availableTags;
    const onListChange: any = props.onListChange;

    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([]);
    const [right, setRight] = React.useState<readonly number[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly number[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly number[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));

        // Right, Left
        onListChange(right.concat(leftChecked), not(left, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));

        // Right, Left
        onListChange(not(right, rightChecked), left.concat(rightChecked));
    };

    useEffect(() => {
        //console.log('T: ', tags)
        //setLeft(tags.map((tag: any) => tag.name));
        if (availableTags)
            setLeft(availableTags.map((tag: any) => tag.name));
        if (selectedTags)
            setRight(selectedTags.map((tag: any) => tag.name));
    }, []);

    useEffect(()=> {
        console.log('Left changed: ', left);
    }, [left])

    useEffect(()=> {
        console.log('Right changed: ', right);
    }, [right]);

    const customList = (title: React.ReactNode, items: readonly number[]) => (
        <Card>
            <CardHeader
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider/>
            <List
                sx={{
                    width: 200,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: number) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`}/>
                        </ListItem>
                    );
                })}
                <ListItem/>
            </List>
        </Card>
    );

    return (
        <>
            <span className={"centered"}>Tags</span>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList('Available', left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList('Chosen', right)}</Grid>
            </Grid>
        </>
    );
}
