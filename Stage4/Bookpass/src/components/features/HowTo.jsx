import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, BookOpen, DollarSign, Star } from 'lucide-react';

const HowTo = ({ activeTab: initialTab = 'buying', showTabSwitcher = true }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [currentTime, setCurrentTime] = useState(0);

    const logoSegments = [
        "M10.7399 28.0362L19.4937 28.0362C26.1211 28.0362 31.4937 22.6636 31.4937 16.0362L31.4937 11.0088",
        "M10.7399 28.0362L18.3973 32.7753C24.353 36.4614 25.8992 44.4434 21.7507 50.0868L12.226 63.0435",
        "M10.7399 28.0362L12.226 63.0435",
        "M10.7399 28.0362L9.56786 4.0981C9.51197 2.9565 10.4225 2.00031 11.5654 2.0003L21.905 2.00019",
        "M10.7399 28.0362C1.11823 34.1727 -0.912789 47.3711 6.41877 56.1165L12.226 63.0435",
        "M21.905 2.00019L21.5099 9.70919C21.4472 10.9334 22.4904 11.9254 23.7099 11.8013L31.4937 11.0088",
        "M21.905 2.00019L31.4937 11.0088"
    ];

    const fullLogoPath = logoSegments.join('');

    const stepPositions = {
        topRight: { x: 45, y: 11 },
        bottomLeft: { x: -8, y: 63 },
        topCenter: { x: 22, y: -8 },
        midLeft: { x: -5, y: 28 },
        bottomRight: { x: 30, y: 55 }
    };

    const buyingSequence = [
        { type: 'segment', index: 0, duration: 0.7 },
        { type: 'connector', from: { x: 31.49, y: 11.0 }, to: stepPositions.topRight, stepIndex: 0, duration: 0.4 },
        { type: 'step', index: 0 },

        { type: 'segment', index: 1, duration: 0.7 },
        { type: 'connector', from: { x: 12.2, y: 63.0 }, to: stepPositions.bottomLeft, stepIndex: 1, duration: 0.4 },
        { type: 'step', index: 1 },

        { type: 'segment', index: 3, duration: 0.7 },
        { type: 'connector', from: { x: 21.9, y: 2.0 }, to: stepPositions.topCenter, stepIndex: 2, duration: 0.4 },
        { type: 'step', index: 2 },

        { type: 'segment', index: 2, duration: 0.4 },
        { type: 'segment', index: 4, duration: 0.4 },
        { type: 'segment', index: 5, duration: 0.4 },
        { type: 'segment', index: 6, duration: 0.4 }
    ];

    const sellingSequence = [
        { type: 'segment', index: 0, duration: 0.7 },
        { type: 'connector', from: { x: 31.49, y: 11.0 }, to: stepPositions.topRight, stepIndex: 0, duration: 0.4 },
        { type: 'step', index: 0 }, // 1. Add Request

        { type: 'segment', index: 1, duration: 0.7 },
        { type: 'connector', from: { x: 12.2, y: 63.0 }, to: stepPositions.bottomLeft, stepIndex: 1, duration: 0.4 },
        { type: 'step', index: 1 }, // 2. Handover & Display (Left)

        { type: 'segment', index: 2, duration: 0.4 },
        { type: 'segment', index: 4, duration: 0.4 }, // Draw other parts

        { type: 'segment', index: 3, duration: 0.7 },
        { type: 'connector', from: { x: 21.9, y: 2.0 }, to: stepPositions.topCenter, stepIndex: 2, duration: 0.4 },
        { type: 'step', index: 2 }, // 3. Buy & Transfer

        { type: 'segment', index: 5, duration: 0.4 },
        { type: 'segment', index: 6, duration: 0.4 }
    ];

    const currentSequence = activeTab === 'buying' ? buyingSequence : sellingSequence;
    const totalLoopDuration = currentSequence.reduce((acc, item) => acc + (item.duration || 0), 0) + 2;

    useEffect(() => {
        let startTime = Date.now();
        const loop = () => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            setCurrentTime(elapsed % totalLoopDuration);
            requestAnimationFrame(loop);
        };
        const frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [totalLoopDuration, activeTab]);

    const getItemState = (itemIndex) => {
        let timeAccumulator = 0;
        for (let i = 0; i < itemIndex; i++) {
            timeAccumulator += (currentSequence[i].duration || 0);
        }
        const startTime = timeAccumulator;
        const endTime = startTime + (currentSequence[itemIndex].duration || 0);

        if (currentTime < startTime) return { progress: 0, active: false, done: false };
        if (currentTime >= endTime) return { progress: 1, active: false, done: true };

        const progress = (currentTime - startTime) / (currentSequence[itemIndex].duration || 0.001);
        return { progress, active: true, done: false };
    };

    const buyingStepsData = [
        { icon: Search, label: 'البحث عن الكتاب', align: 'right' },
        { icon: ShoppingCart, label: 'السداد', align: 'left' },
        { icon: null, label: 'استلام الكتاب', customIcon: true, align: 'right' }
    ];

    // Updated Selling Steps - Reduced to 3
    const sellingStepsData = [
        { label: 'إضافة طلب', customIcon: 'book-add', align: 'right' },
        { label: 'تسليم وعرض الكتاب', customIcon: 'badge', align: 'left' }, // Combined step, Left aligned
        { icon: DollarSign, label: 'شراء وتحويل', align: 'left' } // Make this left or right? Usually top center looks good with either. Let's try Left to differ from Buying's top center which is Right? Or stick to Right.
        // User said "buying... text of payment should be on left".
        // User said "selling... text of book handover... on left".
        // Maybe the top center one fits better on Left too if it's crowded? 
        // Let's keep 'Right' for Top Center unless requested, as it usually has space.
        // Wait, "شراء وتحويل" is the last step.
    ];

    // Align correction for step 3 based on visual balance
    sellingStepsData[2].align = 'right';

    const stepsData = activeTab === 'buying' ? buyingStepsData : sellingStepsData;
    const CIRCLE_RADIUS = 8.0; // Radius in SVG units

    // Generate stars only once to prevent re-render flickering
    const stars = useMemo(() => {
        return [...Array(20)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: Math.random() * 5 + 3, // Slower: 3-8 seconds
            delay: Math.random() * 5
        }));
    }, []);

    return (
        <div className="w-full h-full bg-brand-secondary flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden text-right" dir="rtl">
            {/* Constellation Background Stars */}
            <div className="absolute inset-0 z-0">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: '2px',
                            height: '2px',
                            top: star.top,
                            left: star.left,
                        }}
                        animate={{
                            opacity: [0.1, 0.7, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: star.delay
                        }}
                    />
                ))}
            </div>


            {/* Tab Switcher */}
            {showTabSwitcher && (
                <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 mb-8 z-10 w-full max-w-[280px]">
                    <button
                        onClick={() => setActiveTab('buying')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'buying'
                            ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(193,117,84,0.5)]'
                            : 'text-brand-muted hover:text-white'
                            }`}
                    >
                        شراء
                    </button>
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'selling'
                            ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(193,117,84,0.5)]'
                            : 'text-brand-muted hover:text-white'
                            }`}
                    >
                        بيع
                    </button>
                </div>
            )}

            {/* Main Animation Container - Responsive & Centered */}
            <div className="w-full max-w-lg flex-1 relative z-10 min-h-[300px] h-full max-h-[43vh] md:max-h-[55vh] flex items-center justify-center p-4 md:p-8">

                {/* Aspect Ratio Wrapper - Ensures perfect alignment between SVG and Overlay */}
                {/* Ghost Strut Wrapper - The invisible SVG determines the physical size, ensuring aspect ratio is NEVER violated */}
                <div className="relative inline-flex h-full w-auto items-center justify-center mx-auto">

                    {/* The Ghost SVG: Invisible, but drives the width/height respecting max constraints */}
                    <svg
                        viewBox="0 0 34 67"
                        className="h-full w-auto max-h-[60vh] max-w-[80vw] md:max-w-[60vw] opacity-0 pointer-events-none block"
                        aria-hidden="true"
                    >
                        {/* A simple invisible rect to ensure it takes up space if path logic fails, though viewBox handles it */}
                        <path d={fullLogoPath} fill="transparent" stroke="transparent" />
                    </svg>

                    {/* The Real Content: Absolutely positioned to perfectly match the Ghost's geometry */}
                    <div className="absolute inset-0 w-full h-full">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 34 67"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Background Trace */}
                            <path
                                d={fullLogoPath}
                                fill="none"
                                stroke="rgba(193, 117, 84, 0.1)"
                                strokeWidth="1.5"
                            />

                            {/* Drawing Elements */}
                            {currentSequence.map((item, i) => {
                                const { progress } = getItemState(i);

                                if (item.type === 'segment') {
                                    return (
                                        <path
                                            key={`seg-${i}`}
                                            d={logoSegments[item.index]}
                                            stroke="#C17554"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 * (1 - progress)}
                                            pathLength="100"
                                            style={{
                                                opacity: progress > 0 ? 1 : 0, // Keep segments visible after drawing
                                                filter: "drop-shadow(0 0 6px rgba(193, 117, 84, 0.6))"
                                            }}
                                        />
                                    );
                                } else if (item.type === 'connector') {
                                    // REFACTORED: Draw Circle instead of Box
                                    const CIRCLE_R = CIRCLE_RADIUS;

                                    const to = item.to;
                                    const from = item.from;

                                    // Vector from 'from' to 'to'
                                    const dx = to.x - from.x;
                                    const dy = to.y - from.y;
                                    const dist = Math.sqrt(dx * dx + dy * dy);

                                    // Direction unit vector
                                    const ux = dx / dist;
                                    const uy = dy / dist;

                                    // Stop line at circle edge
                                    // Entry point is 'to' minus Radius in the direction of the line
                                    const entryX = to.x - ux * CIRCLE_R;
                                    const entryY = to.y - uy * CIRCLE_R;

                                    // Draw Line
                                    let pathD = `M ${from.x} ${from.y} L ${entryX} ${entryY}`;

                                    // Draw Circle (2 arcs) starting from entry point
                                    // We need to draw a full circle starting from (entryX, entryY)
                                    // Arc command: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                                    // To draw a full circle from a point on the edge, we go to the opposite side and back
                                    // But 'entry' is dynamic. 
                                    // Simpler: Draw arc to (to.x + R, to.y) then around? 
                                    // Actually, just drawing 2 semi-circles relative to entry point is fine, 
                                    // BUT to look like a "continuous drawing", it's best to loop around.
                                    // Let's assume we draw clockwise or counter-clockwise depending on side.
                                    // To make it simple and robust:
                                    // 1. Move to entry point (already there).
                                    // 2. Draw Arc to opposite point through center? No.
                                    // Easier: simple circle path logic using arc.

                                    // The entry point is on the circle.
                                    // We want to trace the circumference 360 degrees.
                                    // We can do it in two 180 degree arcs.
                                    // Target point for first arc: Opposite side of circle? 
                                    // Let's just hardcode a standard circle path drawing for consistency,
                                    // slightly adjusted to start near the entry if possible, or just standard circle.
                                    // IF we want the line to seamlessly turn into the circle trigger, we start at impact point.

                                    // Calculate opposite point across diameter
                                    const exitX = to.x + ux * CIRCLE_R; // Ideally strictly opposite
                                    const exitY = to.y + uy * CIRCLE_R;

                                    // BUT standard SVG circles usually start at 3 o'clock (0 degrees).
                                    // To look "drawn", starting at impact point is best.

                                    // Arc 1: entry -> opposite
                                    pathD += ` A ${CIRCLE_R} ${CIRCLE_R} 0 1 1 ${exitX} ${exitY}`;
                                    // Arc 2: opposite -> entry
                                    pathD += ` A ${CIRCLE_R} ${CIRCLE_R} 0 1 1 ${entryX} ${entryY}`;

                                    return (
                                        <path
                                            key={`conn-${i}`}
                                            d={pathD}
                                            stroke="#C17554"
                                            strokeWidth="0.5"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 * (1 - progress)}
                                            pathLength="100"
                                            fill="none"
                                            style={{
                                                opacity: progress > 0 ? 0.6 : 0
                                            }}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </svg>

                        {/* Steps Overlay */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            {currentSequence.map((item, i) => {
                                if (item.type !== 'step') return null;
                                const connectorItem = currentSequence[i - 1];
                                if (!connectorItem || connectorItem.type !== 'connector') return null;

                                const position = connectorItem.to;
                                const stepData = stepsData[item.index];
                                const { done, active } = getItemState(i);
                                const isVisible = done || active;

                                // Use shared constant
                                const CIRCLE_R = CIRCLE_RADIUS;
                                const DIAMETER = CIRCLE_R * 2;

                                return (
                                    <div
                                        key={`step-node-real-${i}`}
                                        className="absolute flex items-center justify-center pointer-events-auto transition-all duration-500 ease-out"
                                        style={{
                                            left: `${(position.x / 34) * 100}%`,
                                            top: `${(position.y / 67) * 100}%`,
                                            width: '100%', // Critical for child % sizing
                                            height: '100%', // Critical for child % sizing
                                            opacity: isVisible ? 1 : 0,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 20,
                                            pointerEvents: 'none' // Ensure wrapper doesn't block clicks (children can re-enable if needed)
                                        }}
                                    >
                                        {/* 
                                            Real Invisible Circle Container
                                            Dimensions set by % relative to the wrapper.
                                         */}
                                        <div
                                            className="relative flex items-center justify-center"
                                            style={{
                                                width: `${(DIAMETER / 34) * 100}%`, // ~20% of width
                                                aspectRatio: '1/1', // Keep it circular
                                                transform: `scale(${isVisible ? 1 : 0.5})`,
                                                transition: 'transform 0.5s',
                                            }}
                                        >
                                            {/* Number Badge - Floating Above */}
                                            <div
                                                className="absolute -top-[40%] md:-top-[40%] left-1/2 -translate-x-1/2 text-[#C17554] font-bold text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                            >
                                                {item.index + 1}
                                            </div>

                                            {/* Icon - Centered in Circle */}
                                            <div className={`text-[#C17554] drop-shadow-[0_0_10px_rgba(193,117,84,0.6)] flex items-center justify-center w-full h-full`}>
                                                {stepData.icon ? <stepData.icon className="w-3/5 h-3/5" /> : (
                                                    <div className="w-3/5 h-3/5 flex items-center justify-center">
                                                        {stepData.customIcon === 'book-add' && <BookOpen className="w-full h-full" />}
                                                        {stepData.customIcon === 'badge' && <Star className="w-full h-full" />}
                                                        {stepData.customIcon === true && <Star className="w-full h-full" />}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text Label - Position based on step index */}
                                            {/* index 2 is Top step -> Label on Left Side */}
                                            {/* index 0,1 are Side steps -> Label on Bottom (nearer) */}
                                            <div
                                                className={`
                                                    absolute flex 
                                                    ${item.index === 2
                                                        ? 'top-1/2 -translate-y-1/2 right-[80%] w-full justify-end text-left' // Top Step: Left side (physical right of text at circle left)
                                                        : 'top-[110%] left-1/2 -translate-x-1/2 w-[200%] justify-center text-center' // Side Steps: Bottom
                                                    }
                                                `}
                                            >
                                                <p className="text-[0.6rem] md:text-[0.8rem] font-bold text-white/90 leading-tight whitespace-nowrap">
                                                    {stepData.label}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowTo;
