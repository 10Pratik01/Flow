import React from 'react';
import styled from 'styled-components';

const Loader: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="loader-con">
        {/* Cast the style object to React.CSSProperties */}
        <div style={{ '--i': 0 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 1 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 2 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 3 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 4 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 5 } as React.CSSProperties} className="pfile" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader-con {
    position: relative;
    width: 40%;
    height: 500px;
    overflow: hidden;
    margin-left:auto;
    margin-right:auto;  
    margin-bottom:auto; 
  }

  .pfile {
    position: absolute;
    bottom: 25px;
    width: 60px;
    height: 70px;
    background: linear-gradient(90deg, #b324db, #ac8dcb);
    border-radius: 4px;
    transform-origin: center;
    animation: flyRight 3s ease-in-out infinite;
    opacity: 0;
  }

  .pfile::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    width: 28px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  .pfile::after {
    content: "";
    position: absolute;
    top: 13px;
    left: 6px;
    width: 18px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  @keyframes flyRight {
    0% {
      left: -10%;
      transform: scale(0);
      opacity: 0;
    }
    50% {
      left: 45%;
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      left: 100%;
      transform: scale(0);
      opacity: 0;
    }
  }

  .pfile {
    animation-delay: calc(var(--i) * 0.6s);
  }
`;

export default Loader;
