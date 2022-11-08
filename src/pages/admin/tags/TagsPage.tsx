import React, {useEffect} from 'react';
import TagsService, {ETagIcon} from "../../../services/TagsService";
import {DataGrid, GridCellEditStopParams, MuiEvent} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TagsPage = () => {
    const [data, setData] = React.useState([]);
    const [canRender, setCanRender] = React.useState(false);

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
                return <span>{params.row.name}</span>
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
                return <span>{params.row.description}</span>
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
                        <Icon/> <span>&nbsp;{params.row.icon}</span>
                    </>
                else return <span>{params.row.icon}</span>
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
                        <Button variant="contained" onClick={() => {

                        }}><EditIcon/></Button>
                    </>
                )
            }
        }
    ]

    return (
        <div>
            <h1 className={"centered border-bottom"}>Tags</h1>
            {canRender ?
                <>
                    <div className={"centered"} style={{height: '550px', width: '100%'}}>
                        <DataGrid sx={{
                            width: '90%',
                            height: '90%'
                        }} columns={columns} rows={data}
                                  checkboxSelection
                                  onSelectionModelChange={(selected) => {
                                  }} experimentalFeatures={{newEditingApi: true}}
                                  onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
                                      console.log('Params: ', params);
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
                                      newRow[fieldToUpdate] = formattedValue; // FIXME: not working
                                      console.debug('Field to update: ', fieldToUpdate);
                                      console.debug('Formatted value: ', formattedValue);
                                      console.debug('New row: ', newRow);
                                  }}
                        />
                    </div>
                </>
                : <h1>Loading...</h1>}
        </div>
    );
};

export default TagsPage;
