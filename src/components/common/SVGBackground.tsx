interface IBackground {
  height?: string;
}
export default function SVGBackground({ height }: IBackground) {
  return (
    <svg
      id="visual"
      viewBox="0 0 900 600"
      width="100%"
      height={height ?? "100vh"}
      className="absolute inset-0 z-[-1] bg-accent"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <rect x="0" y="0" width="900" height="600" fill="#2f2074"></rect>
      <g fill="#86a1dc">
        <circle r="89" cx="499" cy="295"></circle>
        <circle r="39" cx="863" cy="496"></circle>
        <circle r="75" cx="663" cy="471"></circle>
        <circle r="68" cx="577" cy="67"></circle>
        <circle r="61" cx="155" cy="555"></circle>
        <circle r="62" cx="845" cy="103"></circle>
        <circle r="49" cx="226" cy="146"></circle>
        <circle r="51" cx="79" cy="284"></circle>
        <circle r="68" cx="430" cy="482"></circle>
        <circle r="86" cx="818" cy="288"></circle>
        <circle r="41" cx="274" cy="378"></circle>
        <circle r="51" cx="38" cy="23"></circle>
        <circle r="80" cx="352" cy="10"></circle>
      </g>
    </svg>
  );
}
