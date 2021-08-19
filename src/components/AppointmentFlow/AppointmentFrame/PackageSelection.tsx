import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled} from "@material-ui/core";
import {CheckBoxOutlined} from "@material-ui/icons";

const border = '1px solid #DADADA';


type TService = {
    name: string;
    description?: string;
    packages: number[];
}
type TPackage = {
    id: number;
    name: string;
};

const packages: TPackage[] = [
    {id: 1, name: "Factory"},
    {id: 2, name: "Value"},
    {id: 3, name: "Premium"},
];
const complimentary: TService[] = [
    {
        name: "Top Off Fluids",
        packages: [1,2,3]
    },
    {
        name: "Courtesy Car Wash",
        packages: [1,2,3]
    },
    {
        name: "Courtesy Spray Wax",
        packages: [2,3]
    }
]
const services: TService[] = [
    {
        name: "Replace Engine Oil & Filter",
        description: "Mobil 1 Synthetic Oil (Up to 6 Quarts)",
        packages: [1,2,3]
    },
    {
        name: "Rotate & Balance Tires",
        packages: [1,2,3]
    },
    {
        name: "Perform Multi-Point Inspection",
        packages: [1,2,3]
    },
    {
        name: "Replace Front Wiper Blades",
        packages: [2,3]
    },
    {
        name: "Replace Cabin Air Filter",
        packages: [2,3]
    },
    {
        name: "Perform Wheel Alignment",
        packages: [3]
    },
    {
        name: "Replace Engine Air Filter",
        packages: [3]
    }
];

const Wrapper = styled('div')({
    display: "grid",
    marginTop: 12,
    gap: "0 20px",
    gridTemplateColumns: "2fr repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    "&>div": {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: border,
        padding: '2px 8px',
        fontWeight: "bold",
        borderLeft: border,
        borderRight: border,
        '&.top': {
            borderTop: border
        },
        '&:nth-child(4n+1)': {
            textAlign: "right",
            justifyContent: "flex-end"
        },
        "&.gray": {
            background: "#DADADA"
        },
        "&.title": {
            padding: 20,
            fontSize: 20,
            textTransform: "uppercase"
        },
        "&.subtitle": {
            textTransform: "uppercase"
        },
        "&.service": {
            padding: "6px 8px"
        },
        "&.green": {
            background: "#E6FCEC"
        },
        "&.green.subtitle": {
            background: "#89E5AB"
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            padding: "16px 8px",
            color: "#008331"
        },
        "&.total": {
            padding: 8,
            "&.price": {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                alignItems: "center",
                justifyContent: "center",
                "&>.before": {
                    textDecoration: "line-through",
                    fontWeight: "normal"
                }
            },
            "&>.info": {
                display: "inline-block",
                marginLeft: 4,
                textTransform: "none",
                fontWeight: "normal"
            }
        }
    }
});

export const PackageSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    return (
        <StepWrapper>
            <Wrapper>
                <div className='top' />
                {packages.map(p => <div className="top title" key={p.id}>{p.name}</div>)}
                <div className="gray subtitle">Included in package</div>
                {packages.map(p => <div className="gray subtitle" key={p.id} />)}
                {services.map((s, idx) => {
                    const isLast = idx+1 === services.length;
                    const cls = `service${isLast ? ' last' : ''}`;
                    return <React.Fragment key={s.name}>
                        <div className={cls}>{s.name}</div>
                        {packages.map(p =>
                            <div key={p.id} className={cls}>
                                {s.packages.includes(p.id) ? <CheckBoxOutlined/> : ""}
                            </div>
                        )}
                    </React.Fragment>;
                })}
                <div className="green subtitle">Complimentary</div>
                {packages.map(p =>
                    <div key={p.id} className="green subtitle" />
                )}
                {complimentary.map(c => <React.Fragment key={c.name}>
                    <div className="service">{c.name}</div>
                    {packages.map(p =>
                        <div key={p.id} className="service green">
                            {c.packages.includes(p.id) ? <CheckBoxOutlined /> : ""}
                        </div>
                    )}
                </React.Fragment>)}
                <div className="totalComplimentary last">Total Complimentary Value</div>
                {packages.map(p =>
                    <div className="totalComplimentary last" key={p.id}>$50</div>
                )}
                <div className="total">
                    Total <span className="info">(excluding taxes)</span>
                </div>
                {packages.map(p =>
                    <div className="total price" key={p.id}>
                        <div className="before">$115</div>
                        <div className="current">$65</div>
                    </div>
                )}
            </Wrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};