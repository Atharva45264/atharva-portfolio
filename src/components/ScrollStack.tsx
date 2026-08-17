import React, {
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>
    {children}
  </div>
);

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;

  /* Distance between cards before stacking */
  itemDistance?: number;

  /* Additional scale adjustment for deeper cards */
  itemScale?: number;

  /* Distance between cards while stacked */
  itemStackDistance?: number;

  /* Position where stacking begins */
  stackPosition?: string;

  /* Position where scaling finishes */
  scaleEndPosition?: string;

  /* Minimum scale of the first card */
  baseScale?: number;

  /* Small rotation for depth */
  rotationAmount?: number;

  /* Optional blur for cards deeper in the stack */
  blurAmount?: number;

  useWindowScroll?: boolean;

  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',

  itemDistance = 70,
  itemScale = 0.015,
  itemStackDistance = 28,

  stackPosition = '16%',
  scaleEndPosition = '8%',

  baseScale = 0.94,

  rotationAmount = 1,

  blurAmount = 0,

  useWindowScroll = true,

  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const stackCompletedRef = useRef(false);

  const animationFrameRef = useRef<number | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  const cardsRef = useRef<HTMLElement[]>([]);

  const initialTopsRef = useRef<number[]>([]);

  const lastTransformsRef = useRef<
    Map<
      number,
      {
        translateY: number;
        scale: number;
        rotation: number;
        blur: number;
      }
    >
  >(new Map());

  const isUpdatingRef = useRef(false);

  /* ============================================
     CALCULATE PROGRESS
  ============================================ */

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop <= start) return 0;

      if (scrollTop >= end) return 1;

      const distance = end - start;

      if (distance <= 0) return 1;

      return (scrollTop - start) / distance;
    },
    []
  );

  /* ============================================
     PARSE POSITION
  ============================================ */

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }

      return typeof value === 'number'
        ? value
        : parseFloat(value);
    },
    []
  );

  /* ============================================
     GET SCROLL DATA
  ============================================ */

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    }

    const scroller = scrollerRef.current;

    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? 0,
    };
  }, [useWindowScroll]);

  /* ============================================
     FIND STACK END
  ============================================ */

  const getEndElementTop = useCallback(() => {
    const endElement = useWindowScroll
      ? (document.querySelector(
          '.scroll-stack-end'
        ) as HTMLElement | null)
      : (scrollerRef.current?.querySelector(
          '.scroll-stack-end'
        ) as HTMLElement | null);

    if (!endElement) {
      return 0;
    }

    return (
      endElement.getBoundingClientRect().top +
      window.scrollY
    );
  }, [useWindowScroll]);

  /* ============================================
     UPDATE CARD TRANSFORMS
  ============================================ */

  const updateCardTransforms = useCallback(() => {
    if (
      !cardsRef.current.length ||
      isUpdatingRef.current
    ) {
      return;
    }

    isUpdatingRef.current = true;

    const {
      scrollTop,
      containerHeight,
    } = getScrollData();

    const stackPositionPx = parsePercentage(
      stackPosition,
      containerHeight
    );

    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight
    );

    const endElementTop = getEndElementTop();

    /*
     * Find which card is currently closest to
     * the stacking position.
     */
    let topCardIndex = 0;

    cardsRef.current.forEach((_, index) => {
      const cardTop =
        initialTopsRef.current[index] ?? 0;

      const triggerStart =
        cardTop -
        stackPositionPx -
        itemStackDistance * index;

      if (scrollTop >= triggerStart) {
        topCardIndex = index;
      }
    });

    /* ============================================
       UPDATE EACH CARD
    ============================================ */

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTop =
        initialTopsRef.current[index] ?? 0;

      /*
       * When does this card begin stacking?
       */
      const triggerStart =
        cardTop -
        stackPositionPx -
        itemStackDistance * index;

      /*
       * When does the scaling finish?
       */
      const triggerEnd =
        cardTop -
        scaleEndPositionPx;

      /*
       * Pinning boundaries.
       */
      const pinStart = triggerStart;

      const pinEnd =
        endElementTop -
        containerHeight / 2;

      /* ==========================================
         SCALE
      ========================================== */

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd
      );

      /*
       * Keep the cards larger than before.
       *
       * Previous:
       * baseScale = 0.88
       *
       * New:
       * baseScale = 0.94
       *
       * This keeps the project preview readable.
       */

      const targetScale =
        baseScale + index * itemScale;

      const scale =
        1 -
        scaleProgress *
          (1 - targetScale);

      /* ==========================================
         ROTATION
      ========================================== */

      const rotation =
        rotationAmount
          ? index *
            rotationAmount *
            scaleProgress
          : 0;

      /* ==========================================
         BLUR
      ========================================== */

      let blur = 0;

      if (blurAmount > 0) {
        if (index < topCardIndex) {
          const depth =
            topCardIndex - index;

          blur = Math.max(
            0,
            depth * blurAmount
          );
        }
      }

      /*
       * We intentionally keep blur at 0
       * for your portfolio because your
       * project screenshots need to remain
       * sharp.
       */

      /* ==========================================
         TRANSLATION
      ========================================== */

      let translateY = 0;

      const isPinned =
        scrollTop >= pinStart &&
        scrollTop <= pinEnd;

      if (isPinned) {
        translateY =
          scrollTop -
          cardTop +
          stackPositionPx +
          itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY =
          pinEnd -
          cardTop +
          stackPositionPx +
          itemStackDistance * index;
      }

      /* ==========================================
         ROUND VALUES
      ========================================== */

      const newTransform = {
        translateY:
          Math.round(
            translateY * 100
          ) / 100,

        scale:
          Math.round(
            scale * 1000
          ) / 1000,

        rotation:
          Math.round(
            rotation * 100
          ) / 100,

        blur:
          Math.round(
            blur * 100
          ) / 100,
      };

      /* ==========================================
         CHECK IF TRANSFORM CHANGED
      ========================================== */

      const lastTransform =
        lastTransformsRef.current.get(
          index
        );

      const hasChanged =
        !lastTransform ||
        Math.abs(
          lastTransform.translateY -
            newTransform.translateY
        ) > 0.1 ||
        Math.abs(
          lastTransform.scale -
            newTransform.scale
        ) > 0.001 ||
        Math.abs(
          lastTransform.rotation -
            newTransform.rotation
        ) > 0.1 ||
        Math.abs(
          lastTransform.blur -
            newTransform.blur
        ) > 0.1;

      /* ==========================================
         APPLY TRANSFORM
      ========================================== */

      if (hasChanged) {
        const transform = `
          translate3d(
            0,
            ${newTransform.translateY}px,
            0
          )
          scale(${newTransform.scale})
          rotate(${newTransform.rotation}deg)
        `.replace(/\s+/g, ' ').trim();

        const filter =
          newTransform.blur > 0
            ? `blur(${newTransform.blur}px)`
            : 'none';

        card.style.transform =
          transform;

        card.style.filter =
          filter;

        /*
         * Important:
         * Never fade project cards while stacking.
         */
        card.style.opacity = '1';

        lastTransformsRef.current.set(
          index,
          newTransform
        );
      }

      /* ==========================================
         STACK COMPLETION
      ========================================== */

      if (
        index ===
        cardsRef.current.length - 1
      ) {
        const isInView =
          scrollTop >= pinStart &&
          scrollTop <= pinEnd;

        if (
          isInView &&
          !stackCompletedRef.current
        ) {
          stackCompletedRef.current = true;

          onStackComplete?.();
        } else if (
          !isInView &&
          stackCompletedRef.current
        ) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getEndElementTop,
  ]);

  /* ============================================
     SCROLL HANDLER
  ============================================ */

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  /* ============================================
     LENIS
  ============================================ */

  const setupLenis = useCallback(() => {
    const lenis = new Lenis({
      duration: 1.15,

      easing: (t: number) =>
        Math.min(
          1,
          1.001 -
            Math.pow(2, -10 * t)
        ),

      smoothWheel: true,

      wheelMultiplier: 1,

      touchMultiplier: 1.5,

      infinite: false,
    });

    lenis.on(
      'scroll',
      handleScroll
    );

    const raf = (time: number) => {
      lenis.raf(time);

      animationFrameRef.current =
        requestAnimationFrame(raf);
    };

    animationFrameRef.current =
      requestAnimationFrame(raf);

    lenisRef.current = lenis;

    return lenis;
  }, [handleScroll]);

  /* ============================================
     INITIAL SETUP
  ============================================ */

  useLayoutEffect(() => {
    const cards = Array.from(
      document.querySelectorAll(
        '.scroll-stack-card'
      )
    ) as HTMLElement[];

    cardsRef.current = cards;

    /*
     * Record natural positions BEFORE
     * transforms are applied.
     */
    initialTopsRef.current =
      cards.map((card) => {
        const rect =
          card.getBoundingClientRect();

        return (
          rect.top +
          window.scrollY
        );
      });

    /* ==========================================
       INITIAL CARD STYLES
    ========================================== */

    cards.forEach(
      (card, index) => {
        /*
         * Later cards sit above earlier cards.
         */
        card.style.zIndex =
          `${index + 1}`;

        /*
         * Space between cards before
         * they enter the stack.
         */
        if (
          index <
          cards.length - 1
        ) {
          card.style.marginBottom =
            `${itemDistance}px`;
        }

        card.style.willChange =
          'transform, filter';

        card.style.transformOrigin =
          'top center';

        card.style.backfaceVisibility =
          'hidden';

        card.style.opacity = '1';

        card.style.transform =
          'translate3d(0, 0, 0) scale(1)';

        card.style.perspective =
          '1000px';

        /*
         * Prevent the browser from creating
         * unwanted visual fading.
         */
        card.style.mixBlendMode =
          'normal';
      }
    );

    /* ==========================================
       START LENIS
    ========================================== */

    setupLenis();

    updateCardTransforms();

    /* ==========================================
       CLEANUP
    ========================================== */

    return () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
      }

      stackCompletedRef.current =
        false;

      cardsRef.current = [];

      initialTopsRef.current = [];

      lastTransformsRef.current.clear();

      isUpdatingRef.current =
        false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
  ]);

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}

        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;