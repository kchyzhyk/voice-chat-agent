import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(74, 206, 159, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(74, 206, 159, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 206, 159, 0);
  }
`;

const LandingContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  padding: "2rem",
  textAlign: "center",
});

const Title = styled("h1")({
  fontSize: "3rem",
  marginBottom: "2rem",
  color: "#2c3e50",
  fontWeight: 700,
});

const Subtitle = styled("p")({
  fontSize: "1.2rem",
  marginBottom: "3rem",
  color: "#7f8c8d",
  maxWidth: "600px",
});

const CallButton = styled("button")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  fontWeight: 600,
  color: "white",
  background: "#4a46ff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: `${pulse} 2s infinite`,
  "&:hover": {
    background: "#3a36df",
    transform: "translateY(-3px)",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
});

const StyledPhoneIcon = styled(PhoneIcon)({
  marginLeft: "0.5rem",
  fontSize: "1.5rem",
});

const FeaturesList = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1.5rem",
  marginTop: "3rem",
  maxWidth: "800px",
});

const FeatureCard = styled("div")({
  background: "white",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  width: "200px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
});

interface LandingProps {
  onStartCall: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartCall }) => {
  const features = [
    {
      icon: "🎙️",
      title: "Voice Interaction",
      description: "Natural conversation with our AI agent",
    },
    {
      icon: "🔊",
      title: "Audio Responses",
      description: "Hear clear voice replies",
    },
    {
      icon: "⏱️",
      title: "Fast Processing",
      description: "Real-time communication",
    },
  ];

  return (
    <LandingContainer>
      <Title>Welcome to Voice Assistant</Title>
      <Subtitle>
        Experience natural voice conversations with our AI agent. Click below to
        start talking.
      </Subtitle>

      <CallButton onClick={onStartCall}>
        Call Jessica
        <StyledPhoneIcon />
      </CallButton>

      <FeaturesList>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {feature.icon}
            </div>
            <h3 style={{ margin: "0.5rem 0", color: "#2c3e50" }}>
              {feature.title}
            </h3>
            <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
              {feature.description}
            </p>
          </FeatureCard>
        ))}
      </FeaturesList>
    </LandingContainer>
  );
};
