"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function BackgroundParticles() {
    const particlesInit = useCallback(async (engine: unknown) => {
        await loadSlim(engine as Parameters<typeof loadSlim>[0]);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="absolute inset-0 z-0 pointer-events-none theme-dark-only"
            options={{
                fullScreen: {
                    enable: false,
                },

                background: {
                    color: "transparent",
                },

                fpsLimit: 60,

                interactivity: {
                    events: {
                        onHover: {
                            enable: false,
                        },
                        onClick: {
                            enable: false,
                        },
                        resize: true,
                    },
                },

                particles: {
                    number: {
                        value: 150,
                        density: {
                            enable: true,
                            area: 900,
                        },
                    },

                    color: {
                        value: "#ffffff",
                    },

                    shape: {
                        type: "circle",
                    },

                    opacity: {
                        value: {
                            min: 0.15,
                            max: 0.7,
                        },
                        animation: {
                            enable: true,
                            speed: 0.3,
                            minimumValue: 0.05,
                            sync: false,
                        },
                    },

                    size: {
                        value: {
                            min: 0.4,
                            max: 2,
                        },
                        animation: {
                            enable: true,
                            speed: 1,
                            minimumValue: 0.2,
                            sync: false,
                        },
                    },

                    links: {
                        enable: false,
                    },

                    move: {
                        enable: true,

                        // horizontal star movement
                        direction: "right",

                        speed: 0.50,

                        random: true,

                        straight: true,

                        outModes: {
                            default: "out",
                        },

                        trail: {
                            enable: false,
                        },
                    },
                },

                detectRetina: true,
            }}
        />
    );
}