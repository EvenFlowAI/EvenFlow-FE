import React, {useCallback, useState} from 'react';
import {DialogTitle, DialogContent, BaseModal} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Wrapper} from "./styles";
import {Autocomplete} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useAutocompleteStyles} from "../../../../hooks/styling/useAutocompleteStyles";
import Checkbox from "../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {IGlobalMake} from "../../../../store/reducers/globalVehicles/types";

const MakesOptionsModal: React.FC<DialogProps> = (props) => {
    const {allMakesOptions} = useSelector((state: RootState) => state.globalVehicles)
    const [selected, setSelected] = useState<IGlobalMake[]>([])
    const { classes  } = useAutocompleteStyles();
    const onCancel = () => {
        props.onClose()
    }

    const renderMakeOption = useCallback((props: any, option: IGlobalMake) => {
        const currentOptionSelected = !!selected.find(el => el.id === option.id)
        const allSelected = allMakesOptions.length === selected.length
        const checked = currentOptionSelected || allSelected;
        return <li style={{display: 'flex', alignItems: 'center'}} {...props} key={option}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
            />
            {option.vinMake}
        </li>
    }, [selected, allMakesOptions]);

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Makes Options</DialogTitle>
            <DialogContent>
                <Wrapper>
                    <div>
                        <Autocomplete
                            multiple
                            classes={classes}
                            renderInput={autocompleteRender({
                                label: "Add Makes",
                                placeholder: "Select Makes",
                            })}
                            fullWidth
                            getOptionLabel={o => o.vinMake}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={renderMakeOption}
                            options={allMakesOptions}/>
                    </div>
                </Wrapper>
            </DialogContent>
        </BaseModal>
    );
};

export default MakesOptionsModal;