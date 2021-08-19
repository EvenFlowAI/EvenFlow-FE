import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled} from "@material-ui/core";

const border = '1px solid #DADADA';

const Wrapper = styled('div')({
    display: "grid",
    gap: "1px 20px",
    gridTemplateColumns: "repeat(4, 1fr)",
    width: "100%",
    alignItems: "center",
    "&>div": {
        textAlign: "center",
        borderBottom: border,
        padding: '2px 8px',
        fontWeight: "bold",
        borderLeft: border,
        borderRight: border,
        '&.top': {
            borderTop: border
        },
        '&:nth-child(4n+1)': {
            textAlign: "right"
        }
    }
})

export const PackageSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    return (
        <StepWrapper>
            <Wrapper>
                <div className='top'>1</div>
                <div className='top'>2</div>
                <div className='top'>3</div>
                <div className='top'>4</div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
            </Wrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};