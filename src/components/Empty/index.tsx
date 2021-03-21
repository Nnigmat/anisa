import React from 'react';

type EmptyProps = {
    size: 's' | 'm' | 'l';

} & React.HTMLAttributes<HTMLDivElement>;

const sizes = {
    s: 50,
    m: 100,
    l: 150,
}

export const Empty = ({ size, style, ...props}: EmptyProps) => (
    <div style={{ ...style, height: sizes[size] }} {...props} />
);
