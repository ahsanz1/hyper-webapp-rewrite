import styled from 'styled-components'

const hyprColor = '#f55d2c';

export const ArrowWrapper = styled.div`
    .slick-arrow{
        background-color: grey;
        height: 19px;
        width: 19px;
        border-radius: 10px;
    }
    .slick-arrow:hover,
  .slick-arrow:active {
    background-color: ${hyprColor} !important;
  }

  .slick-prev, .slick-next {
    top: 40%
  }
`;

// .slick-arrow:hover,
//   .slick-arrow:active,
//   .slick-arrow:focus {
//     background-color: red !important;
//   }