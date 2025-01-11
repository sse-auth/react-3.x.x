import * as React from "react";

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}

export const BungieIcon: React.FC<SVGComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    enableBackground="new 0 0 72.125 22.875"
    viewBox="0 0 500 145.653"
    {...props}
  >
    <g transform="translate(-14.477 -6.714)scale(7.06516)">
      <defs>
        <path id="a" d="M2.048.95H72.82v20.618H2.048z" />
      </defs>
      <clipPath id="c">
        <use
          height="100%"
          width="100%"
          style={{
            overflow: "visible",
          }}
          overflow="visible"
          xlinkHref="#a"
        />
      </clipPath>
      <defs>
        <filter
          height={18.979}
          width={39.466}
          y={0.95}
          x={16.952}
          filterUnits="userSpaceOnUse"
          id="b"
        >
          <feFlood result="back" />
          <feBlend in2="back" in="SourceGraphic" />
        </filter>
      </defs>
      <mask
        id="g"
        height={18.979}
        width={39.466}
        y={0.95}
        x={16.952}
        maskUnits="userSpaceOnUse"
      >
        <g
          style={{
            filter: "url(#b)",
          }}
        >
          <defs>
            <path
              transform="rotate(-179.99 37.643 13.097)"
              id="d"
              d="M.885-1.914h73.516v30.021H.885z"
            />
          </defs>
          <clipPath clipPath="url(#c)" id="f">
            <use
              height="100%"
              width="100%"
              style={{
                overflow: "visible",
              }}
              overflow="visible"
              xlinkHref="#d"
            />
          </clipPath>
          <linearGradient
            gradientTransform="matrix(29.0984 0 0 -29.0984 8282.156 7951.114)"
            y2={272.799}
            x2={-283.083}
            y1={272.799}
            x1={-284.082}
            gradientUnits="userSpaceOnUse"
            id="e"
          >
            <stop
              style={{
                stopColor: "#231f20",
              }}
              offset={0}
            />
            <stop
              style={{
                stopColor: "#f5f5f6",
              }}
              offset={0.852}
            />
            <stop
              style={{
                stopColor: "#fff",
              }}
              offset={1}
            />
          </linearGradient>
          <path
            style={{
              fill: "url(#e)",
            }}
            clipPath="url(#f)"
            d="M.883-1.921h73.52v30.035H.883z"
          />
        </g>
      </mask>
      <g mask="url(#g)" clipPath="url(#c)">
        <defs>
          <path id="h" d="M16.952.95h39.465v18.979H16.952z" />
        </defs>
        <clipPath id="i">
          <use
            height="100%"
            width="100%"
            style={{
              overflow: "visible",
            }}
            overflow="visible"
            xlinkHref="#h"
          />
        </clipPath>
        <g clipPath="url(#i)">
          <defs>
            <path id="j" d="M16.952.95h39.465v18.979H16.952z" />
          </defs>
          <clipPath id="k">
            <use
              height="100%"
              width="100%"
              style={{
                overflow: "visible",
              }}
              overflow="visible"
              xlinkHref="#j"
            />
          </clipPath>
          <path
            style={{
              fill: "#bbbdbf",
            }}
            d="M56.418 8.447C52.112 3.802 45.588.756 38.443.96c-16.699.476-21.578 14.39-21.49 18.97.893-9.04 9.261-17.615 21.202-17.527 6.819.052 13.037 3.28 16.617 7.582.275-.794.992-1.338 1.646-1.538"
            clipPath="url(#k)"
          />
        </g>
      </g>
      <path
        d="M2.373 21.317a.324.324 0 0 1-.324-.323V9.938c0-.178.145-.324.324-.324h3.636l2.325-.001c1.729.004 3.77.976 3.771 3.209 0 1.245-.887 1.905-1.32 2.321.663.336 1.554 1.323 1.555 2.752.001 1.119-.436 1.98-1.156 2.556-.721.575-1.722.866-2.85.866H5.527Zm1.768-5.073a.326.326 0 0 0-.323.324v2.655c0 .178.146.325.323.325h4.193c1.551-.009 2.231-.569 2.235-1.653-.007-1.012-.5-1.641-2.235-1.651zm4.192-1.771c1.125-.001 1.998-.65 2.001-1.65-.003-.891-.838-1.433-2.001-1.436H4.141a.325.325 0 0 0-.323.323v2.439c0 .178.146.323.323.323zm6.565 2.417c0 1.104.209 2.273.96 3.17.75.896 2.04 1.508 4.174 1.506h.001c2.133 0 3.423-.61 4.173-1.506.751-.896.96-2.066.96-3.17V9.938a.324.324 0 0 0-.324-.324H23.72a.325.325 0 0 0-.324.324v6.952c-.009 1.687-.677 2.894-3.364 2.903-2.687-.01-3.354-1.217-3.364-2.903V9.938a.325.325 0 0 0-.324-.324h-1.122a.325.325 0 0 0-.324.324zm22.404 1.161c0 .178-.09.208-.199.069l-6.447-8.25a.75.75 0 0 0-.523-.257h-1.097a.325.325 0 0 0-.324.324v11.059c0 .178.145.324.324.324h1.123a.325.325 0 0 0 .324-.324v-8.112c0-.179.089-.21.2-.069l6.445 8.249c.11.142.345.254.524.254h1.097a.324.324 0 0 0 .324-.323V9.938a.325.325 0 0 0-.324-.324h-1.123a.324.324 0 0 0-.323.324v8.113zm20.626-4.114h-1.122a.324.324 0 0 0-.324.324v6.734c0 .179.147.325.325.325h1.12c.18 0 .326-.146.326-.325v-6.734a.326.326 0 0 0-.325-.324m5.439 5.611a.325.325 0 0 1-.324-.324V16.43c0-.179.146-.324.324-.324h4.439a.325.325 0 0 0 .324-.323v-1.126a.326.326 0 0 0-.324-.324h-4.439a.324.324 0 0 1-.324-.323v-2.3c0-.177.146-.323.324-.323h6.758a.325.325 0 0 0 .322-.324V9.938a.324.324 0 0 0-.322-.324h-8.528a.325.325 0 0 0-.324.324v11.058c0 .179.146.325.324.325h8.821a.325.325 0 0 0 .324-.325v-1.124a.324.324 0 0 0-.324-.323h-7.051zm-15.028-8.459c1.733 0 2.63.728 3.213 1.295l.126.12a.32.32 0 0 0 .456-.002l.779-.801a.324.324 0 0 0-.007-.457l-.123-.111c-.778-.716-2.203-1.817-4.615-1.817-1.867 0-3.467.686-4.602 1.791a5.95 5.95 0 0 0-1.801 4.295c0 1.985.814 3.517 2.021 4.549 1.202 1.031 2.794 1.564 4.351 1.564 3.446-.004 4.87-1.529 5.186-1.931l.045-.056a1 1 0 0 1 .066-.086c.004-.004.006-.024.006-.046v-3.982a.325.325 0 0 0-.324-.323h-4.131a.324.324 0 0 0-.324.323v1.078c0 .179.146.324.324.324h2.353c.179 0 .325.146.325.323v1.244c0 .18-.038.356-.084.396l-.064.048q-.038.03-.08.058c-.468.338-1.373.858-3.218.858-2.913-.001-4.678-2.016-4.679-4.264.001-2.405 1.75-4.388 4.801-4.39"
        clipPath="url(#c)"
      />
      <path
        style={{
          fill: "#00a3e3",
        }}
        d="M57.367 9.506a1.665 1.665 0 1 0 0 3.33 1.665 1.665 0 0 0 0-3.33"
        clipPath="url(#c)"
      />
      <path
        d="M72.162 10.151q.132 0 .193.026.11.044.109.18 0 .095-.069.141a.3.3 0 0 1-.103.034.17.17 0 0 1 .123.07.2.2 0 0 1 .037.11v.053l.002.053.006.037.006.009h-.116l-.002-.007-.001-.008-.003-.023v-.056q0-.124-.067-.163-.04-.024-.139-.023h-.099v.281h-.125v-.713h.248zm.133.113a.3.3 0 0 0-.149-.026h-.106v.258h.112a.3.3 0 0 0 .119-.016q.073-.03.073-.111 0-.08-.049-.105m.336.707a.62.62 0 0 1-.457.19.62.62 0 0 1-.455-.19.63.63 0 0 1-.188-.461q0-.268.189-.458a.6.6 0 0 1 .453-.189q.27 0 .457.189a.62.62 0 0 1 .189.458q.001.27-.188.461m-.848-.857a.54.54 0 0 0-.162.396q0 .232.16.397a.53.53 0 0 0 .393.165.53.53 0 0 0 .394-.165.54.54 0 0 0 .161-.397.54.54 0 0 0-.161-.396.53.53 0 0 0-.394-.165.53.53 0 0 0-.391.165"
        clipPath="url(#c)"
      />
    </g>
  </svg>
);

export const ClickUpIcon: React.FC<SVGComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="-ml-1 size-3.5"
    fill="none"
    viewBox="0 0 185 185"
    {...props}
  >
    <g filter="url(#a)">
      <rect width={125} height={125} x={30} y={20} fill="#fff" rx={62.5} />
      <rect width={125} height={125} x={30} y={20} fill="#fff" rx={62.5} />
      <path
        fill="url(#b)"
        fillRule="evenodd"
        d="m55.9 105.7 13.5-10.3c7.2 9.3 14.8 13.7 23.3 13.7 8.4 0 15.9-4.3 22.7-13.6l13.7 10c-9.9 13.5-22.2 20.6-36.4 20.6s-26.6-7-36.8-20.4Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#c)"
        fillRule="evenodd"
        d="m92.6 60.7-24 20.7-11.1-12.9 35.2-30.3 35 30.4-11.2 12.8-23.9-20.7Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={55.9}
        x2={129.1}
        y1={116.3}
        y2={116.3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8930FD" />
        <stop offset={1} stopColor="#49CCF9" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={57.5}
        x2={127.6}
        y1={67.6}
        y2={67.6}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF02F0" />
        <stop offset={1} stopColor="#FFC800" />
      </linearGradient>
      <filter
        id="a"
        width={185}
        height={185}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={10} />
        <feGaussianBlur stdDeviation={15} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.117647 0 0 0 0 0.211765 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);