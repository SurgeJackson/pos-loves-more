export default function CircleProgress({className="w-6 h-6", progress, checked}) {
    const size = 32;
    const radius = size/2 - 4;
    const circumference = 2 * 3.14 * radius;
    return (
        <svg className={className}
                viewBox={"0 0 " + size + " " + size}>
            <circle r={radius} cx={size/2} cy={size/2} 
                fill="transparent"
                stroke="lightgrey"
                strokeWidth={5}>
            </circle>
            <circle r={radius} cx={size/2} cy={size/2}  
                fill="transparent"
                stroke="blue"
                strokeLinecap="round"
                strokeWidth={5}
                strokeDasharray={circumference + "px"}
                strokeDashoffset={circumference * progress/100 + "px"}>
                    {checked && (
                    <animate attributeName="opacity" dur="2s" values="0;1;0" repeatCount="indefinite" begin="0.1" />)}
            </circle>
        </svg>
   );
}
