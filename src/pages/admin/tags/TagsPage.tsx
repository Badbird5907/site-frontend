import React, {useEffect} from 'react';
import TagsService, {ETagIcon} from "../../../services/TagsService";
import {
    Button, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import {Theme, useTheme} from "@mui/material/styles";
import {DataGrid, GridCellEditCommitParams, MuiBaseEvent} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

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

const TagsPage = () => {
    const [data, setData] = React.useState([]);
    const [canRender, setCanRender] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newTagName, setNewTagName] = React.useState("");
    const [newTagIcon, setNewTagIcon] = React.useState(ETagIcon.NONE);
    const [newTagDescription, setNewTagDescription] = React.useState("");

    useEffect(() => {
        update()
    }, [])

    function update() {
        TagsService.getTags().then((res) => {
            console.log('Data: ', res.data);
            setData(res.data.tags);
            setCanRender(true);
        })
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params: any) => {
                return <span className={"noselect"} onClick={(e) => {
                    e.stopPropagation()
                }}>{params.row.name}</span>
            },
            editable: true
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 300,
            renderCell: (params: any) => {
                return <span>{params.row.id}</span>
            }
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 200,
            renderCell: (params: any) => {
                return <span className={"noselect"} onClick={(e) => {
                    e.stopPropagation()
                }}>{params.row.description}</span>
            },
            editable: true
        },
        {
            field: 'icon',
            headerName: 'Icon',
            width: 130,
            renderCell: (params: any) => {
                const eTagIcon = ETagIcon.getIconByName(params.row.icon);
                var Icon = null;
                if (eTagIcon) {
                    Icon = eTagIcon.getIcon();
                } else Icon = null;
                if (Icon)
                    return <>
                        <Icon/> <span className={"noselect"} onClick={(e) => {
                        e.stopPropagation()
                    }}>&nbsp;{params.row.icon}</span>
                    </>
                else return <span className={"noselect"} onClick={(e) => {
                    e.stopPropagation()
                }}>{params.row.icon}</span>
            },
            editable: true,
            type: 'singleSelect',
            valueOptions: () => {
                const options: any = [];
                ETagIcon.getAllIcons().forEach((icon) => {
                    options.push(icon.getName());
                });
                return options;
            }
        },
        {
            field: 'actions', headerName: 'Actions', width: 500, sortable: false, renderCell: (params: any) => {
                return (
                    <>
                        <Button color={"error"} variant="contained" onClick={() => {
                            Swal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'error',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.value) {
                                    TagsService.delete(params.row.id).then((res) => {
                                        Swal.fire(
                                            'Deleted!',
                                            'The tag has been deleted.',
                                            'success'
                                        )
                                        update();
                                    })
                                }
                            });
                        }}><DeleteIcon/></Button>
                    </>
                )
            }
        }
    ]


    function getStyles(theme: Theme) {
        return {
            fontWeight:
            theme.typography.fontWeightRegular
        };
    }

    const theme = useTheme();

    return (
        <div>
            <h1 className={"centered border-bottom"}>Tags</h1>
            {canRender ? <div className={"centered"} style={{height: '550px', width: '100%'}}>

                <Dialog open={openDialog} onClose={() => {
                    setOpenDialog(false)
                }}>
                    <DialogTitle>Add Tag</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setNewTagName(e.target.value);
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setNewTagDescription(e.target.value);
                            }}
                        />

                        <Select
                            labelId="select-icon"
                            id="select-icon-select"
                            value={newTagIcon}
                            label="Select Icon"
                            fullWidth
                            sx={{
                                marginTop: "15px"
                            }}
                            onChange={(e) => {
                                setNewTagIcon(e.target.value as ETagIcon);
                            }}
                            renderValue={(value: any) => {
                                const Icon = value.icon;
                                if (Icon) {
                                    return (
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            <Chip key={value.name} label={value.name} icon={<Icon/>}/>
                                        </Box>
                                    )
                                } else {
                                    return (
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            <Chip key={value.name} label={value.name}/>
                                        </Box>
                                    )
                                }
                            }}
                        >
                            {ETagIcon.getAllIcons().map((icon) => {
                                const Icon = icon.getIcon();
                                if (Icon) { // @ts-ignore
                                    return <MenuItem key={icon.getName()}
                                                     value={icon}
                                                     style={getStyles(theme)}
                                    ><Icon/>&nbsp;{icon.getName()}</MenuItem>
                                } else { // @ts-ignore
                                    return <MenuItem key={icon.getName()}
                                                     style={getStyles(theme)}
                                                     value={icon}>{icon.getName()}</MenuItem>
                                }
                            })}
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenDialog(false);
                        }}>Cancel</Button>
                        <Button onClick={() => {
                            setOpenDialog(false);
                            TagsService.createIconStr(newTagName, newTagDescription, newTagIcon.name).then((res) => {
                                Swal.fire(
                                    'Created!',
                                    'The tag has been created.',
                                    'success'
                                ).then(() => {
                                    update();
                                });
                            });
                        }}>Create</Button>
                    </DialogActions>
                </Dialog>

                <span><b>Click outside the cell twice after editing to commit changes.</b></span>
                <br/>
                <DataGrid sx={{
                    width: '90%',
                    height: '90%'
                }} columns={columns} rows={data}
                          checkboxSelection
                          onSelectionModelChange={(selected) => {
                          }} experimentalFeatures={{newEditingApi: true}}
                          onCellEditCommit={(params: GridCellEditCommitParams,
                                             event: MuiBaseEvent) => {
                              console.log('Params: ', params);
                              console.log('Event: ', event);
                              /*
                              const fieldToUpdate: string = params.field;
                              const {formattedValue} = params;
                              // example row: {
                              //     "id": "07310ebc-6a0d-43a8-bc99-dbdfb434cbf7",
                              //     "name": "Test 2",
                              //     "description": "Test tag 2",
                              //     "icon": "FOLDER"
                              // }
                              // set the new value to the data, then save it
                              // copy the row
                              let newRow: { id: string, name: string, description: string, icon: string } = {
                                  id: params.row.id,
                                  name: params.row.name,
                                  description: params.row.description,
                                  icon: params.row.icon
                              }
                              // set the new value
                              console.log('New row: ', newRow);
                              console.log('Field to update: ', fieldToUpdate);
                              console.log('Formatted value: ', formattedValue);
                              console.log('Defining new value...');
                              try {
                                  //if (Reflect.defineProperty(newRow, fieldToUpdate, {value: formattedValue})) {
                                  if (Reflect.defineProperty(newRow, fieldToUpdate, {value: formattedValue})) {
                                      console.log('Property defined!');
                                      console.log('New row: ', newRow);
                                  } else console.log('Property not defined!');
                              } catch (e) {
                                  console.error('Error setting new value: ', e);
                              }
                               */
                          }}
                          processRowUpdate={(newRow: any, oldRow: any) => { // I have no idea how to properly use this. (https://mui.com/x/react-data-grid/editing/#persistence)
                              return new Promise((resolve, reject) => {
                                  console.log('New row: ', newRow);
                                  console.log('Old row: ', oldRow);
                                  const changed = Object.keys(newRow).some((key) => {
                                      return newRow[key] !== oldRow[key];
                                  });
                                  if (!changed) {
                                      console.log('No changes detected.');
                                      resolve(newRow)
                                      return;
                                  }
                                  TagsService.editIconStr(newRow.id, newRow.name, newRow.description, newRow.icon).then((res) => {
                                      resolve(newRow)
                                      console.log('Resolved!');
                                      update()
                                  });
                              });
                          }}
                          getRowId={(row) => {
                              return row.id;
                          }}
                          onProcessRowUpdateError={(error) => {
                              console.error('Error updating: ', error);
                          }}
                />
                <Fab color="primary" aria-label="add" onClick={() => {
                    setOpenDialog(true)
                }} sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                    <AddIcon/>
                </Fab>
            </div> : null}
        </div>

    );
};

export default TagsPage;
