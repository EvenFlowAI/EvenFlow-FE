import React from 'react';

type TPeriod = "am"|"pm";

type TProps = {
    gap: number;
    start: string;
    end: string;
    value: string;
    onChange: (newValue: string) => void;
    period: TPeriod|null;
}

const TimeSelect: React.FC<TProps> = ({gap, start, end, value, onChange, period}) => {
    return (
        <div>
            
        </div>
    );
};

export default TimeSelect;