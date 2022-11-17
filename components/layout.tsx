import classnames from 'classnames';

import { upperFirst } from "lodash";
import { useRouter } from 'next/router';
import styles from "../css/modules/layout.module.scss";
import Header from "./header";
import HStack, { StackGapSize } from './hstack';
import AccountBanner, { AccountContext, ConnectedApp } from "./LinkedAccountInfo";
import { MintContext } from './mint';
import NFTViewer from './NftViewer';
import VStack from './vstack';

type LayoutType = {
    children: JSX.Element;
    username?: string;
};

const HelixLayout = ({ children }: LayoutType) => {

    const router = useRouter();

    const handleDisconnect = (e) => {
        e.preventDefault();
        router.replace("/mint", undefined, { shallow: true });
    }

    const username = (account) => {
        if (!account.username) {
            return "";
        }
        return `${account.app === ConnectedApp.Twitter ? "@" : ""}${account.username}`;
    }

    const userId = (account) => {
        if (isNaN(account.userid)) {
            return "";
        }
        const id = account.userid as string;
        return `${id.slice(0, 4)} •••• ${id.slice(id.length - 4, id.length)}`;
    }


    return (
        <AccountContext.Consumer>
            {account =>
                <div className={styles.layout}>
                    <div className={classnames(styles.section, styles.sectionGraphic)}>
                        <svg width="213" height="982" viewBox="0 0 213 982" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="M127.317 1045L124.003 1042.79L120.694 1040.57L117.395 1038.36L114.113 1036.14L110.851 1033.93L107.616 1031.72L104.412 1029.5L101.245 1027.29L98.1202 1025.07L95.0417 1022.86L92.0148 1020.65L89.0443 1018.43L86.1351 1016.22L83.2918 1014L80.5189 1011.79L77.8208 1009.58L75.202 1007.36L72.6665 1005.15L70.2185 1002.93L67.8618 1000.72L65.6002 998.506L63.4373 996.292L61.3767 994.078L59.4215 991.864L57.5749 989.65L55.84 987.436L54.2193 985.222L52.7157 983.008L51.3313 980.794L50.0685 978.581L48.9293 976.367L47.9155 974.153L47.0288 971.939L46.2705 969.725L45.6418 967.511L45.1438 965.297L44.7772 963.083L44.5427 960.869L44.4407 958.655L44.4712 956.441L44.6342 954.227L44.9296 952.013L45.3567 949.799L45.9149 947.585L46.6034 945.371L47.421 943.157L48.3664 940.943L49.4381 938.729L50.6344 936.515L51.9534 934.301L53.3929 932.087L54.9508 929.873L56.6243 927.659L58.411 925.445L60.3079 923.231L62.312 921.017L64.4201 918.803L66.6289 916.589L68.9347 914.375L71.3339 912.161L73.8227 909.947L76.397 907.733L79.0528 905.519L81.7859 903.305L84.5917 901.091L87.466 898.877L90.4039 896.663L93.401 894.449L96.4523 892.235L99.5529 890.021L102.698 887.807L105.882 885.593L109.101 883.379L112.349 881.165L115.621 878.951L118.912 876.737L122.216 874.523L125.528 872.309L128.843 870.095L132.155 867.881L135.46 865.667L138.752 863.453L142.026 861.239L145.276 859.025L148.497 856.811L151.684 854.597L154.833 852.383L157.937 850.17L160.992 847.956L163.994 845.742L166.937 843.528L169.816 841.314L172.628 839.1L175.367 836.886L178.029 834.672L180.61 832.458L183.106 830.244L185.512 828.03L187.825 825.816L190.042 823.602L192.158 821.388L194.171 819.174L196.076 816.96L197.872 814.746L199.555 812.532L201.122 810.318L202.571 808.104L203.899 805.89L205.106 803.676L206.187 801.462L207.143 799.248L207.971 797.034L208.669 794.82L209.238 792.606L209.676 790.392L209.981 788.178L210.155 785.964L210.196 783.75L210.105 781.536L209.881 779.322L209.525 777.108L209.037 774.894L208.419 772.68L207.671 770.466L206.794 768.252L205.79 766.038L204.661 763.824L203.408 761.61L202.033 759.396L200.539 757.182L198.928 754.968L197.202 752.754L195.364 750.54L193.417 748.326L191.365 746.112L189.21 743.898L186.956 741.684L184.607 739.47L182.166 737.256L179.637 735.042L177.025 732.828L174.333 730.614L171.566 728.4L168.728 726.186L165.824 723.972L162.858 721.759L159.836 719.545L156.761 717.331L153.639 715.117L150.476 712.903L147.275 710.689L144.042 708.475L140.782 706.261L137.501 704.047L134.204 701.833L130.895 699.619L127.581 697.405L124.267 695.191L120.957 692.977L117.657 690.763L114.373 688.549L111.11 686.335L107.873 684.121L104.666 681.907L101.496 679.693L98.3675 677.479L95.285 675.265L92.2538 673.051L89.2787 670.837L86.3644 668.623L83.5157 666.409L80.737 664.195L78.0328 661.981L75.4075 659.767L72.8653 657.553L70.4101 655.339L68.046 653.125L65.7767 650.911L63.6058 648.697L61.5369 646.483L59.5732 644.269L57.7179 642.055L55.974 639.841L54.3441 637.627L52.8311 635.413L51.4371 633.199L50.1646 630.985L49.0155 628.771L47.9916 626.557L47.0947 624.343L46.3261 622.129L45.6871 619.915L45.1786 617.701L44.8016 615.487L44.5566 613.273L44.4439 611.059L44.4639 608.845L44.6164 606.631L44.9012 604.417L45.3178 602.203L45.8657 599.989L46.5438 597.775L47.3512 595.561L48.2865 593.348L49.3482 591.134L50.5346 588.92L51.8439 586.706L53.2739 584.492L54.8224 582.278L56.4869 580.064L58.2647 577.85L60.1529 575.636L62.1486 573.422L64.2485 571.208L66.4494 568.994L68.7476 566.78L71.1395 564.566L73.6213 562.352L76.189 560.138L78.8385 557.924L81.5655 555.71L84.3657 553.496L87.2347 551.282L90.1678 549.068L93.1603 546.854L96.2074 544.64L99.3043 542.426L102.446 540.212L105.628 537.998L108.844 535.784L112.09 533.57L115.36 531.356L118.649 529.142L121.952 526.928L125.264 524.714L128.579 522.5L131.892 520.286L135.197 518.072L138.49 515.858L141.766 513.644L145.018 511.43L148.241 509.216L151.432 507.002L154.583 504.788L157.691 502.574L160.751 500.36L163.757 498.146L166.705 495.932L169.589 493.718L172.406 491.504L175.151 489.29L177.82 487.076L180.407 484.862L182.91 482.648L185.324 480.434L187.645 478.22L189.869 476.006L191.993 473.792L194.014 471.578L195.929 469.364L197.733 467.15L199.425 464.937L201.001 462.723L202.46 460.509L203.798 458.295L205.014 456.081L206.106 453.867L207.071 451.653L207.909 449.439L208.619 447.225L209.198 445.011L209.646 442.797L209.962 440.583L210.146 438.369L210.198 436.155L210.117 433.941L209.903 431.727L209.558 429.513L209.081 427.299L208.473 425.085L207.735 422.871L206.869 420.657L205.875 418.443L204.756 416.229L203.512 414.015L202.147 411.801L200.662 409.587L199.06 407.373L197.343 405.159L195.514 402.945L193.576 400.731L191.532 398.517L189.385 396.303L187.139 394.089L184.797 391.875L182.364 389.661L179.842 387.447L177.236 385.233L174.55 383.019L171.789 380.805L168.957 378.591L166.058 376.377L163.097 374.163L160.078 371.949L157.008 369.735L153.89 367.521L150.729 365.307L147.531 363.093L144.3 360.879L141.043 358.665L137.763 356.451L134.467 354.237L131.159 352.023L127.845 349.809L124.53 347.595L121.22 345.381L117.92 343.167L114.634 340.953L111.369 338.739L108.129 336.525L104.92 334.312L101.747 332.098L98.615 329.884L95.5287 327.67L92.4932 325.456L89.5134 323.242L86.5941 321.028L83.74 318.814L80.9556 316.6L78.2453 314.386L75.6136 312.172L73.0646 309.958L70.6023 307.744L68.2308 305.53L65.9538 303.316L63.775 301.102L61.6979 298.888L59.7257 296.674L57.8616 294.46L56.1087 292.246L54.4697 290.032L52.9472 287.818L51.5437 285.604L50.2614 283.39L49.1024 281.176L48.0685 278.962L47.1614 276.748L46.3826 274.534L45.7332 272.32L45.2143 270.106L44.8268 267.892L44.5712 265.678L44.4481 263.464L44.4574 261.25L44.5994 259.036L44.8737 256.822L45.2799 254.608L45.8173 252.394L46.4851 250.18L47.2822 247.966L48.2073 245.752L49.259 243.538L50.4356 241.324L51.7352 239.11L53.1557 236.896L54.6948 234.682L56.3501 232.468L58.119 230.254L59.9986 228.04L61.9858 225.826L64.0776 223.612L66.2705 221.398L68.5611 219.184L70.9457 216.97L73.4205 214.756L75.9815 212.542L78.6246 210.328L81.3456 208.114L84.1402 205.901L87.0038 203.687L89.932 201.473L92.9199 199.259L95.9629 197.045L99.056 194.831L102.194 192.617L105.373 190.403L108.587 188.189L111.83 185.975L115.099 183.761L118.386 181.547L121.689 179.333L125 177.119L128.315 174.905L131.628 172.691L134.935 170.477L138.229 168.263L141.506 166.049L144.76 163.835L147.986 161.621L151.179 159.407L154.334 157.193L157.446 154.979L160.509 152.765L163.52 150.551L166.472 148.337L169.362 146.123L172.185 143.909L174.935 141.695L177.61 139.481L180.204 137.267L182.714 135.053L185.135 132.839L187.463 130.625L189.696 128.411L191.828 126.197L193.857 123.983L195.78 121.769L197.593 119.555L199.294 117.341L200.88 115.127L202.348 112.913L203.696 110.699L204.922 108.485L206.023 106.271L206.999 104.057L207.847 101.843L208.567 99.6293L209.156 97.4154L209.615 95.2014L209.942 92.9874L210.136 90.7734L210.198 88.5594L210.128 86.3454L209.925 84.1315L209.59 81.9175L209.123 79.7035L208.526 77.4895L207.799 75.2755L206.942 73.0615L205.959 70.8476L204.849 68.6336L203.616 66.4196L202.26 64.2056L200.785 61.9916L199.192 59.7776L197.484 57.5637L195.664 55.3497L193.735 53.1357L191.699 50.9217L189.56 48.7077L187.322 46.4937L184.987 44.2798L182.561 42.0658L180.046 39.8518L177.447 37.6378L174.767 35.4238L172.012 33.2099L169.185 30.9959L166.291 28.7819L163.335 26.5679L160.321 24.3539L157.254 22.1399L154.14 19.926L150.982 17.712L147.787 15.498L144.559 13.284L141.303 11.07L138.025 8.85604L134.73 6.64206L131.423 4.42807L128.109 2.21409" stroke="#924F35" strokeWidth="5" />
                                <path d="M85.879 -0.000488281L82.5645 2.2182L79.2553 4.43688L75.9568 6.65556L72.6741 8.87425L69.4125 11.0929L66.1773 13.3116L62.9736 15.5303L59.8065 17.749L56.6811 19.9677L53.6025 22.1863L50.5755 24.405L47.605 26.6237L44.6957 28.8424L41.8522 31.0611L39.0793 33.2798L36.3811 35.4984L33.7622 37.7171L31.2267 39.9358L28.7785 42.1545L26.4218 44.3732L24.1601 46.5919L21.9972 48.8105L19.9365 51.0292L17.9813 53.2479L16.1347 55.4666L14.3996 57.6853L12.779 59.904L11.2752 62.1227L9.89084 64.3413L8.62803 66.56L7.4888 68.7787L6.47497 70.9974L5.58818 73.2161L4.82984 75.4348L4.20115 77.6534L3.70313 79.8721L3.33658 82.0908L3.10208 84.3095L3 86.5282L3.03051 88.7468L3.19356 90.9655L3.48889 93.1842L3.91603 95.4029L4.47429 97.6216L5.16278 99.8403L5.9804 102.059L6.92584 104.278L7.99758 106.496L9.19392 108.715L10.5129 110.934L11.9525 113.152L13.5104 115.371L15.184 117.59L16.9708 119.808L18.8677 122.027L20.8719 124.246L22.9801 126.464L25.1888 128.683L27.4947 130.902L29.894 133.121L32.3829 135.339L34.9573 137.558L37.6132 139.777L40.3463 141.995L43.1523 144.214L46.0266 146.433L48.9646 148.651L51.9618 150.87L55.0131 153.089L58.1139 155.307L61.2591 157.526L64.4436 159.745L67.6625 161.963L70.9105 164.182L74.1824 166.401L77.4731 168.619L80.7772 170.838L84.0894 173.057L87.4046 175.276L90.7172 177.494L94.0222 179.713L97.3141 181.932L100.588 184.15L103.838 186.369L107.059 188.588L110.247 190.806L113.395 193.025L116.5 195.244L119.555 197.462L122.557 199.681L125.5 201.9L128.379 204.118L131.191 206.337L133.93 208.556L136.592 210.774L139.173 212.993L141.669 215.212L144.076 217.43L146.389 219.649L148.606 221.868L150.722 224.087L152.735 226.305L154.64 228.524L156.436 230.743L158.118 232.961L159.686 235.18L161.135 237.399L162.463 239.617L163.67 241.836L164.751 244.055L165.707 246.273L166.535 248.492L167.234 250.711L167.802 252.929L168.24 255.148L168.546 257.367L168.719 259.585L168.76 261.804L168.669 264.023L168.445 266.242L168.089 268.46L167.601 270.679L166.983 272.898L166.235 275.116L165.358 277.335L164.354 279.554L163.225 281.772L161.972 283.991L160.597 286.21L159.103 288.428L157.492 290.647L155.766 292.866L153.928 295.084L151.981 297.303L149.929 299.522L147.774 301.74L145.52 303.959L143.17 306.178L140.729 308.397L138.201 310.615L135.588 312.834L132.896 315.053L130.129 317.271L127.291 319.49L124.387 321.709L121.421 323.927L118.398 326.146L115.324 328.365L112.202 330.583L109.038 332.802L105.837 335.021L102.604 337.239L99.3445 339.458L96.0632 341.677L92.7657 343.895L89.4572 346.114L86.143 348.333L82.8283 350.552L79.5185 352.77L76.2189 354.989L72.9348 357.208L69.6713 359.426L66.4338 361.645L63.2274 363.864L60.0572 366.082L56.9284 368.301L53.8458 370.52L50.8145 372.738L47.8393 374.957L44.925 377.176L42.0761 379.394L39.2974 381.613L36.5932 383.832L33.9678 386.05L31.4254 388.269L28.9702 390.488L26.606 392.706L24.3367 394.925L22.1657 397.144L20.0968 399.363L18.133 401.581L16.2777 403.8L14.5336 406.019L12.9038 408.237L11.3906 410.456L9.99666 412.675L8.72409 414.893L7.57495 417.112L6.55107 419.331L5.65411 421.549L4.88549 423.768L4.24644 425.987L3.73798 428.205L3.36094 430.424L3.1159 432.643L3.00327 434.861L3.02322 437.08L3.17573 439.299L3.46054 441.518L3.8772 443.736L4.42505 445.955L5.1032 448.174L5.91058 450.392L6.8459 452.611L7.90765 454.83L9.09413 457.048L10.4035 459.267L11.8335 461.486L13.3821 463.704L15.0466 465.923L16.8244 468.142L18.7127 470.36L20.7084 472.579L22.8084 474.798L25.0093 477.016L27.3076 479.235L29.6996 481.454L32.1815 483.673L34.7493 485.891L37.3988 488.11L40.1259 490.329L42.9263 492.547L45.7953 494.766L48.7284 496.985L51.721 499.203L54.7683 501.422L57.8653 503.641L61.0071 505.859L64.1887 508.078L67.405 510.297L70.6509 512.515L73.9211 514.734L77.2105 516.953L80.5137 519.171L83.8255 521.39L87.1406 523.609L90.4537 525.828L93.7594 528.046L97.0526 530.265L100.328 532.484L103.58 534.702L106.804 536.921L109.994 539.14L113.146 541.358L116.254 543.577L119.314 545.796L122.32 548.014L125.268 550.233L128.152 552.452L130.97 554.67L133.715 556.889L136.383 559.108L138.971 561.326L141.473 563.545L143.887 565.764L146.208 567.982L148.433 570.201L150.557 572.42L152.578 574.639L154.492 576.857L156.297 579.076L157.989 581.295L159.565 583.513L161.024 585.732L162.362 587.951L163.578 590.169L164.67 592.388L165.635 594.607L166.474 596.825L167.183 599.044L167.762 601.263L168.21 603.481L168.526 605.7L168.71 607.919L168.762 610.137L168.681 612.356L168.468 614.575L168.122 616.794L167.645 619.012L167.037 621.231L166.299 623.45L165.433 625.668L164.439 627.887L163.32 630.106L162.076 632.324L160.711 634.543L159.226 636.762L157.624 638.98L155.907 641.199L154.078 643.418L152.14 645.636L150.096 647.855L147.949 650.074L145.703 652.292L143.361 654.511L140.927 656.73L138.405 658.948L135.799 661.167L133.114 663.386L130.352 665.605L127.52 667.823L124.621 670.042L121.659 672.261L118.641 674.479L115.57 676.698L112.452 678.917L109.291 681.135L106.093 683.354L102.863 685.573L99.6049 687.791L96.3252 690.01L93.0288 692.229L89.721 694.447L86.407 696.666L83.0922 698.885L79.7818 701.104L76.4812 703.322L73.1956 705.541L69.9303 707.76L66.6906 709.978L63.4815 712.197L60.3082 714.416L57.1759 716.634L54.0895 718.853L51.0539 721.072L48.0741 723.29L45.1547 725.509L42.3005 727.728L39.516 729.946L36.8057 732.165L34.1738 734.384L31.6247 736.602L29.1624 738.821L26.7909 741.04L24.5138 743.258L22.3349 745.477L20.2577 747.696L18.2855 749.915L16.4214 752.133L14.6684 754.352L13.0293 756.571L11.5068 758.789L10.1032 761.008L8.82093 763.227L7.66189 765.445L6.62798 767.664L5.72085 769.883L4.94196 772.101L4.29255 774.32L3.77367 776.539L3.38613 778.757L3.13057 780.976L3.00738 783.195L3.01677 785.413L3.15873 787.632L3.43302 789.851L3.8392 792.07L4.37663 794.288L5.04445 796.507L5.84158 798.726L6.76676 800.944L7.8185 803.163L8.99512 805.382L10.2947 807.6L11.7153 809.819L13.2545 812.038L14.9098 814.256L16.6787 816.475L18.5583 818.694L20.5456 820.912L22.6375 823.131L24.8305 825.35L27.1211 827.568L29.5058 829.787L31.9806 832.006L34.5417 834.224L37.1849 836.443L39.906 838.662L42.7007 840.881L45.5644 843.099L48.4926 845.318L51.4807 847.537L54.5237 849.755L57.6169 851.974L60.7554 854.193L63.934 856.411L67.1477 858.63L70.3914 860.849L73.6599 863.067L76.9479 865.286L80.2503 867.505L83.5616 869.723L86.8766 871.942L90.19 874.161L93.4966 876.38L96.7909 878.598L100.068 880.817L103.322 883.036L106.548 885.254L109.742 887.473L112.897 889.692L116.008 891.91L119.072 894.129L122.083 896.348L125.035 898.566L127.925 900.785L130.748 903.004L133.499 905.222L136.173 907.441L138.768 909.66L141.277 911.878L143.698 914.097L146.027 916.316L148.259 918.534L150.392 920.753L152.421 922.972L154.344 925.191L156.157 927.409L157.858 929.628L159.444 931.847L160.912 934.065L162.26 936.284L163.486 938.503L164.588 940.721L165.563 942.94L166.412 945.159L167.131 947.377L167.72 949.596L168.179 951.815L168.506 954.033L168.701 956.252L168.763 958.471L168.692 960.689L168.489 962.908L168.154 965.127L167.688 967.346L167.09 969.564L166.363 971.783L165.506 974.002L164.523 976.22L163.413 978.439L162.18 980.658L160.824 982.876L159.349 985.095L157.756 987.314L156.048 989.532L154.228 991.751L152.298 993.97L150.262 996.188L148.124 998.407L145.885 1000.63L143.551 1002.84L141.124 1005.06L138.609 1007.28L136.01 1009.5L133.33 1011.72L130.575 1013.94L127.748 1016.16L124.854 1018.38L121.897 1020.59L118.883 1022.81L115.817 1025.03L112.702 1027.25L109.545 1029.47L106.349 1031.69L103.121 1033.91L99.8652 1036.12L96.5871 1038.34L93.2918 1040.56L89.9847 1042.78L86.671 1045" stroke="#924F35" strokeWidth="5" />
                            </g>
                        </svg>

                        <svg width="213" height="982" viewBox="0 0 213 982" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="M127.317 1045L124.003 1042.79L120.694 1040.57L117.395 1038.36L114.113 1036.14L110.851 1033.93L107.616 1031.72L104.412 1029.5L101.245 1027.29L98.1202 1025.07L95.0417 1022.86L92.0148 1020.65L89.0443 1018.43L86.1351 1016.22L83.2918 1014L80.5189 1011.79L77.8208 1009.58L75.202 1007.36L72.6665 1005.15L70.2185 1002.93L67.8618 1000.72L65.6002 998.506L63.4373 996.292L61.3767 994.078L59.4215 991.864L57.5749 989.65L55.84 987.436L54.2193 985.222L52.7157 983.008L51.3313 980.794L50.0685 978.581L48.9293 976.367L47.9155 974.153L47.0288 971.939L46.2705 969.725L45.6418 967.511L45.1438 965.297L44.7772 963.083L44.5427 960.869L44.4407 958.655L44.4712 956.441L44.6342 954.227L44.9296 952.013L45.3567 949.799L45.9149 947.585L46.6034 945.371L47.421 943.157L48.3664 940.943L49.4381 938.729L50.6344 936.515L51.9534 934.301L53.3929 932.087L54.9508 929.873L56.6243 927.659L58.411 925.445L60.3079 923.231L62.312 921.017L64.4201 918.803L66.6289 916.589L68.9347 914.375L71.3339 912.161L73.8227 909.947L76.397 907.733L79.0528 905.519L81.7859 903.305L84.5917 901.091L87.466 898.877L90.4039 896.663L93.401 894.449L96.4523 892.235L99.5529 890.021L102.698 887.807L105.882 885.593L109.101 883.379L112.349 881.165L115.621 878.951L118.912 876.737L122.216 874.523L125.528 872.309L128.843 870.095L132.155 867.881L135.46 865.667L138.752 863.453L142.026 861.239L145.276 859.025L148.497 856.811L151.684 854.597L154.833 852.383L157.937 850.17L160.992 847.956L163.994 845.742L166.937 843.528L169.816 841.314L172.628 839.1L175.367 836.886L178.029 834.672L180.61 832.458L183.106 830.244L185.512 828.03L187.825 825.816L190.042 823.602L192.158 821.388L194.171 819.174L196.076 816.96L197.872 814.746L199.555 812.532L201.122 810.318L202.571 808.104L203.899 805.89L205.106 803.676L206.187 801.462L207.143 799.248L207.971 797.034L208.669 794.82L209.238 792.606L209.676 790.392L209.981 788.178L210.155 785.964L210.196 783.75L210.105 781.536L209.881 779.322L209.525 777.108L209.037 774.894L208.419 772.68L207.671 770.466L206.794 768.252L205.79 766.038L204.661 763.824L203.408 761.61L202.033 759.396L200.539 757.182L198.928 754.968L197.202 752.754L195.364 750.54L193.417 748.326L191.365 746.112L189.21 743.898L186.956 741.684L184.607 739.47L182.166 737.256L179.637 735.042L177.025 732.828L174.333 730.614L171.566 728.4L168.728 726.186L165.824 723.972L162.858 721.759L159.836 719.545L156.761 717.331L153.639 715.117L150.476 712.903L147.275 710.689L144.042 708.475L140.782 706.261L137.501 704.047L134.204 701.833L130.895 699.619L127.581 697.405L124.267 695.191L120.957 692.977L117.657 690.763L114.373 688.549L111.11 686.335L107.873 684.121L104.666 681.907L101.496 679.693L98.3675 677.479L95.285 675.265L92.2538 673.051L89.2787 670.837L86.3644 668.623L83.5157 666.409L80.737 664.195L78.0328 661.981L75.4075 659.767L72.8653 657.553L70.4101 655.339L68.046 653.125L65.7767 650.911L63.6058 648.697L61.5369 646.483L59.5732 644.269L57.7179 642.055L55.974 639.841L54.3441 637.627L52.8311 635.413L51.4371 633.199L50.1646 630.985L49.0155 628.771L47.9916 626.557L47.0947 624.343L46.3261 622.129L45.6871 619.915L45.1786 617.701L44.8016 615.487L44.5566 613.273L44.4439 611.059L44.4639 608.845L44.6164 606.631L44.9012 604.417L45.3178 602.203L45.8657 599.989L46.5438 597.775L47.3512 595.561L48.2865 593.348L49.3482 591.134L50.5346 588.92L51.8439 586.706L53.2739 584.492L54.8224 582.278L56.4869 580.064L58.2647 577.85L60.1529 575.636L62.1486 573.422L64.2485 571.208L66.4494 568.994L68.7476 566.78L71.1395 564.566L73.6213 562.352L76.189 560.138L78.8385 557.924L81.5655 555.71L84.3657 553.496L87.2347 551.282L90.1678 549.068L93.1603 546.854L96.2074 544.64L99.3043 542.426L102.446 540.212L105.628 537.998L108.844 535.784L112.09 533.57L115.36 531.356L118.649 529.142L121.952 526.928L125.264 524.714L128.579 522.5L131.892 520.286L135.197 518.072L138.49 515.858L141.766 513.644L145.018 511.43L148.241 509.216L151.432 507.002L154.583 504.788L157.691 502.574L160.751 500.36L163.757 498.146L166.705 495.932L169.589 493.718L172.406 491.504L175.151 489.29L177.82 487.076L180.407 484.862L182.91 482.648L185.324 480.434L187.645 478.22L189.869 476.006L191.993 473.792L194.014 471.578L195.929 469.364L197.733 467.15L199.425 464.937L201.001 462.723L202.46 460.509L203.798 458.295L205.014 456.081L206.106 453.867L207.071 451.653L207.909 449.439L208.619 447.225L209.198 445.011L209.646 442.797L209.962 440.583L210.146 438.369L210.198 436.155L210.117 433.941L209.903 431.727L209.558 429.513L209.081 427.299L208.473 425.085L207.735 422.871L206.869 420.657L205.875 418.443L204.756 416.229L203.512 414.015L202.147 411.801L200.662 409.587L199.06 407.373L197.343 405.159L195.514 402.945L193.576 400.731L191.532 398.517L189.385 396.303L187.139 394.089L184.797 391.875L182.364 389.661L179.842 387.447L177.236 385.233L174.55 383.019L171.789 380.805L168.957 378.591L166.058 376.377L163.097 374.163L160.078 371.949L157.008 369.735L153.89 367.521L150.729 365.307L147.531 363.093L144.3 360.879L141.043 358.665L137.763 356.451L134.467 354.237L131.159 352.023L127.845 349.809L124.53 347.595L121.22 345.381L117.92 343.167L114.634 340.953L111.369 338.739L108.129 336.525L104.92 334.312L101.747 332.098L98.615 329.884L95.5287 327.67L92.4932 325.456L89.5134 323.242L86.5941 321.028L83.74 318.814L80.9556 316.6L78.2453 314.386L75.6136 312.172L73.0646 309.958L70.6023 307.744L68.2308 305.53L65.9538 303.316L63.775 301.102L61.6979 298.888L59.7257 296.674L57.8616 294.46L56.1087 292.246L54.4697 290.032L52.9472 287.818L51.5437 285.604L50.2614 283.39L49.1024 281.176L48.0685 278.962L47.1614 276.748L46.3826 274.534L45.7332 272.32L45.2143 270.106L44.8268 267.892L44.5712 265.678L44.4481 263.464L44.4574 261.25L44.5994 259.036L44.8737 256.822L45.2799 254.608L45.8173 252.394L46.4851 250.18L47.2822 247.966L48.2073 245.752L49.259 243.538L50.4356 241.324L51.7352 239.11L53.1557 236.896L54.6948 234.682L56.3501 232.468L58.119 230.254L59.9986 228.04L61.9858 225.826L64.0776 223.612L66.2705 221.398L68.5611 219.184L70.9457 216.97L73.4205 214.756L75.9815 212.542L78.6246 210.328L81.3456 208.114L84.1402 205.901L87.0038 203.687L89.932 201.473L92.9199 199.259L95.9629 197.045L99.056 194.831L102.194 192.617L105.373 190.403L108.587 188.189L111.83 185.975L115.099 183.761L118.386 181.547L121.689 179.333L125 177.119L128.315 174.905L131.628 172.691L134.935 170.477L138.229 168.263L141.506 166.049L144.76 163.835L147.986 161.621L151.179 159.407L154.334 157.193L157.446 154.979L160.509 152.765L163.52 150.551L166.472 148.337L169.362 146.123L172.185 143.909L174.935 141.695L177.61 139.481L180.204 137.267L182.714 135.053L185.135 132.839L187.463 130.625L189.696 128.411L191.828 126.197L193.857 123.983L195.78 121.769L197.593 119.555L199.294 117.341L200.88 115.127L202.348 112.913L203.696 110.699L204.922 108.485L206.023 106.271L206.999 104.057L207.847 101.843L208.567 99.6293L209.156 97.4154L209.615 95.2014L209.942 92.9874L210.136 90.7734L210.198 88.5594L210.128 86.3454L209.925 84.1315L209.59 81.9175L209.123 79.7035L208.526 77.4895L207.799 75.2755L206.942 73.0615L205.959 70.8476L204.849 68.6336L203.616 66.4196L202.26 64.2056L200.785 61.9916L199.192 59.7776L197.484 57.5637L195.664 55.3497L193.735 53.1357L191.699 50.9217L189.56 48.7077L187.322 46.4937L184.987 44.2798L182.561 42.0658L180.046 39.8518L177.447 37.6378L174.767 35.4238L172.012 33.2099L169.185 30.9959L166.291 28.7819L163.335 26.5679L160.321 24.3539L157.254 22.1399L154.14 19.926L150.982 17.712L147.787 15.498L144.559 13.284L141.303 11.07L138.025 8.85604L134.73 6.64206L131.423 4.42807L128.109 2.21409" stroke="#924F35" strokeWidth="5" />
                                <path d="M85.879 -0.000488281L82.5645 2.2182L79.2553 4.43688L75.9568 6.65556L72.6741 8.87425L69.4125 11.0929L66.1773 13.3116L62.9736 15.5303L59.8065 17.749L56.6811 19.9677L53.6025 22.1863L50.5755 24.405L47.605 26.6237L44.6957 28.8424L41.8522 31.0611L39.0793 33.2798L36.3811 35.4984L33.7622 37.7171L31.2267 39.9358L28.7785 42.1545L26.4218 44.3732L24.1601 46.5919L21.9972 48.8105L19.9365 51.0292L17.9813 53.2479L16.1347 55.4666L14.3996 57.6853L12.779 59.904L11.2752 62.1227L9.89084 64.3413L8.62803 66.56L7.4888 68.7787L6.47497 70.9974L5.58818 73.2161L4.82984 75.4348L4.20115 77.6534L3.70313 79.8721L3.33658 82.0908L3.10208 84.3095L3 86.5282L3.03051 88.7468L3.19356 90.9655L3.48889 93.1842L3.91603 95.4029L4.47429 97.6216L5.16278 99.8403L5.9804 102.059L6.92584 104.278L7.99758 106.496L9.19392 108.715L10.5129 110.934L11.9525 113.152L13.5104 115.371L15.184 117.59L16.9708 119.808L18.8677 122.027L20.8719 124.246L22.9801 126.464L25.1888 128.683L27.4947 130.902L29.894 133.121L32.3829 135.339L34.9573 137.558L37.6132 139.777L40.3463 141.995L43.1523 144.214L46.0266 146.433L48.9646 148.651L51.9618 150.87L55.0131 153.089L58.1139 155.307L61.2591 157.526L64.4436 159.745L67.6625 161.963L70.9105 164.182L74.1824 166.401L77.4731 168.619L80.7772 170.838L84.0894 173.057L87.4046 175.276L90.7172 177.494L94.0222 179.713L97.3141 181.932L100.588 184.15L103.838 186.369L107.059 188.588L110.247 190.806L113.395 193.025L116.5 195.244L119.555 197.462L122.557 199.681L125.5 201.9L128.379 204.118L131.191 206.337L133.93 208.556L136.592 210.774L139.173 212.993L141.669 215.212L144.076 217.43L146.389 219.649L148.606 221.868L150.722 224.087L152.735 226.305L154.64 228.524L156.436 230.743L158.118 232.961L159.686 235.18L161.135 237.399L162.463 239.617L163.67 241.836L164.751 244.055L165.707 246.273L166.535 248.492L167.234 250.711L167.802 252.929L168.24 255.148L168.546 257.367L168.719 259.585L168.76 261.804L168.669 264.023L168.445 266.242L168.089 268.46L167.601 270.679L166.983 272.898L166.235 275.116L165.358 277.335L164.354 279.554L163.225 281.772L161.972 283.991L160.597 286.21L159.103 288.428L157.492 290.647L155.766 292.866L153.928 295.084L151.981 297.303L149.929 299.522L147.774 301.74L145.52 303.959L143.17 306.178L140.729 308.397L138.201 310.615L135.588 312.834L132.896 315.053L130.129 317.271L127.291 319.49L124.387 321.709L121.421 323.927L118.398 326.146L115.324 328.365L112.202 330.583L109.038 332.802L105.837 335.021L102.604 337.239L99.3445 339.458L96.0632 341.677L92.7657 343.895L89.4572 346.114L86.143 348.333L82.8283 350.552L79.5185 352.77L76.2189 354.989L72.9348 357.208L69.6713 359.426L66.4338 361.645L63.2274 363.864L60.0572 366.082L56.9284 368.301L53.8458 370.52L50.8145 372.738L47.8393 374.957L44.925 377.176L42.0761 379.394L39.2974 381.613L36.5932 383.832L33.9678 386.05L31.4254 388.269L28.9702 390.488L26.606 392.706L24.3367 394.925L22.1657 397.144L20.0968 399.363L18.133 401.581L16.2777 403.8L14.5336 406.019L12.9038 408.237L11.3906 410.456L9.99666 412.675L8.72409 414.893L7.57495 417.112L6.55107 419.331L5.65411 421.549L4.88549 423.768L4.24644 425.987L3.73798 428.205L3.36094 430.424L3.1159 432.643L3.00327 434.861L3.02322 437.08L3.17573 439.299L3.46054 441.518L3.8772 443.736L4.42505 445.955L5.1032 448.174L5.91058 450.392L6.8459 452.611L7.90765 454.83L9.09413 457.048L10.4035 459.267L11.8335 461.486L13.3821 463.704L15.0466 465.923L16.8244 468.142L18.7127 470.36L20.7084 472.579L22.8084 474.798L25.0093 477.016L27.3076 479.235L29.6996 481.454L32.1815 483.673L34.7493 485.891L37.3988 488.11L40.1259 490.329L42.9263 492.547L45.7953 494.766L48.7284 496.985L51.721 499.203L54.7683 501.422L57.8653 503.641L61.0071 505.859L64.1887 508.078L67.405 510.297L70.6509 512.515L73.9211 514.734L77.2105 516.953L80.5137 519.171L83.8255 521.39L87.1406 523.609L90.4537 525.828L93.7594 528.046L97.0526 530.265L100.328 532.484L103.58 534.702L106.804 536.921L109.994 539.14L113.146 541.358L116.254 543.577L119.314 545.796L122.32 548.014L125.268 550.233L128.152 552.452L130.97 554.67L133.715 556.889L136.383 559.108L138.971 561.326L141.473 563.545L143.887 565.764L146.208 567.982L148.433 570.201L150.557 572.42L152.578 574.639L154.492 576.857L156.297 579.076L157.989 581.295L159.565 583.513L161.024 585.732L162.362 587.951L163.578 590.169L164.67 592.388L165.635 594.607L166.474 596.825L167.183 599.044L167.762 601.263L168.21 603.481L168.526 605.7L168.71 607.919L168.762 610.137L168.681 612.356L168.468 614.575L168.122 616.794L167.645 619.012L167.037 621.231L166.299 623.45L165.433 625.668L164.439 627.887L163.32 630.106L162.076 632.324L160.711 634.543L159.226 636.762L157.624 638.98L155.907 641.199L154.078 643.418L152.14 645.636L150.096 647.855L147.949 650.074L145.703 652.292L143.361 654.511L140.927 656.73L138.405 658.948L135.799 661.167L133.114 663.386L130.352 665.605L127.52 667.823L124.621 670.042L121.659 672.261L118.641 674.479L115.57 676.698L112.452 678.917L109.291 681.135L106.093 683.354L102.863 685.573L99.6049 687.791L96.3252 690.01L93.0288 692.229L89.721 694.447L86.407 696.666L83.0922 698.885L79.7818 701.104L76.4812 703.322L73.1956 705.541L69.9303 707.76L66.6906 709.978L63.4815 712.197L60.3082 714.416L57.1759 716.634L54.0895 718.853L51.0539 721.072L48.0741 723.29L45.1547 725.509L42.3005 727.728L39.516 729.946L36.8057 732.165L34.1738 734.384L31.6247 736.602L29.1624 738.821L26.7909 741.04L24.5138 743.258L22.3349 745.477L20.2577 747.696L18.2855 749.915L16.4214 752.133L14.6684 754.352L13.0293 756.571L11.5068 758.789L10.1032 761.008L8.82093 763.227L7.66189 765.445L6.62798 767.664L5.72085 769.883L4.94196 772.101L4.29255 774.32L3.77367 776.539L3.38613 778.757L3.13057 780.976L3.00738 783.195L3.01677 785.413L3.15873 787.632L3.43302 789.851L3.8392 792.07L4.37663 794.288L5.04445 796.507L5.84158 798.726L6.76676 800.944L7.8185 803.163L8.99512 805.382L10.2947 807.6L11.7153 809.819L13.2545 812.038L14.9098 814.256L16.6787 816.475L18.5583 818.694L20.5456 820.912L22.6375 823.131L24.8305 825.35L27.1211 827.568L29.5058 829.787L31.9806 832.006L34.5417 834.224L37.1849 836.443L39.906 838.662L42.7007 840.881L45.5644 843.099L48.4926 845.318L51.4807 847.537L54.5237 849.755L57.6169 851.974L60.7554 854.193L63.934 856.411L67.1477 858.63L70.3914 860.849L73.6599 863.067L76.9479 865.286L80.2503 867.505L83.5616 869.723L86.8766 871.942L90.19 874.161L93.4966 876.38L96.7909 878.598L100.068 880.817L103.322 883.036L106.548 885.254L109.742 887.473L112.897 889.692L116.008 891.91L119.072 894.129L122.083 896.348L125.035 898.566L127.925 900.785L130.748 903.004L133.499 905.222L136.173 907.441L138.768 909.66L141.277 911.878L143.698 914.097L146.027 916.316L148.259 918.534L150.392 920.753L152.421 922.972L154.344 925.191L156.157 927.409L157.858 929.628L159.444 931.847L160.912 934.065L162.26 936.284L163.486 938.503L164.588 940.721L165.563 942.94L166.412 945.159L167.131 947.377L167.72 949.596L168.179 951.815L168.506 954.033L168.701 956.252L168.763 958.471L168.692 960.689L168.489 962.908L168.154 965.127L167.688 967.346L167.09 969.564L166.363 971.783L165.506 974.002L164.523 976.22L163.413 978.439L162.18 980.658L160.824 982.876L159.349 985.095L157.756 987.314L156.048 989.532L154.228 991.751L152.298 993.97L150.262 996.188L148.124 998.407L145.885 1000.63L143.551 1002.84L141.124 1005.06L138.609 1007.28L136.01 1009.5L133.33 1011.72L130.575 1013.94L127.748 1016.16L124.854 1018.38L121.897 1020.59L118.883 1022.81L115.817 1025.03L112.702 1027.25L109.545 1029.47L106.349 1031.69L103.121 1033.91L99.8652 1036.12L96.5871 1038.34L93.2918 1040.56L89.9847 1042.78L86.671 1045" stroke="#924F35" strokeWidth="5" />
                            </g>
                        </svg>

                    </div>
                    <div className={classnames(styles.section, styles.sectionContent)}>
                        <Header />
                        {children}
                        <AccountBanner isVisible={Boolean(account.userid)}>
                            {account.username && account.userid &&
                                <VStack gapSize={StackGapSize.Small}>
                                    <HStack gapSize={StackGapSize.Small} centerContent>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="9.25" stroke="black" strokeWidth="1.5" />
                                            <path d="M8 13.2759L10.04 16.2906C10.2545 16.6076 10.7311 16.5759 10.9017 16.2332L15 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>

                                        <label>{upperFirst(account.app)} connected</label>
                                    </HStack>

                                    <HStack>
                                        <p>{userId(account)}</p>
                                    </HStack>
                                    <HStack>
                                        <p className="text-color-light text-size-small"><a className="text-color-normal" onClick={handleDisconnect} href="#">Disconnect</a></p>
                                    </HStack>
                                </VStack>
                            }
                        </AccountBanner>
                        <MintContext.Consumer>
                            {mintContext =>
                                <NFTViewer isVisible={mintContext.showOverlay} />
                            }
                        </MintContext.Consumer>
                    </div>
                </div>
            }
        </AccountContext.Consumer>
    );
};

type FullScreenLayoutProps = {
}

export const FullScreenLayout = ({ children }: LayoutType & FullScreenLayoutProps) => {
    return (
        <div className={styles['layout-fullScreen']}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

export default HelixLayout;