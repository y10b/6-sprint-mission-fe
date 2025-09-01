import { useEffect, useRef, useCallback } from "react";

/**
 * 성능 모니터링 훅
 * 컴포넌트 렌더링 성능을 측정하고 최적화 포인트를 찾는 데 도움
 */

interface IPerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
}

interface IUsePerformanceMonitorOptions {
  enabled?: boolean;
  componentName?: string;
  logThreshold?: number; // 이 시간(ms)을 초과하면 경고 로그
}

export function usePerformanceMonitor(
  options: IUsePerformanceMonitorOptions = {}
) {
  const {
    enabled = process.env.NODE_ENV === "development",
    componentName = "Unknown Component",
    logThreshold = 16, // 60fps 기준 16ms
  } = options;

  const renderStartTime = useRef<number>(0);
  const metrics = useRef<IPerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    totalRenderTime: 0,
  });

  // 렌더링 시작 시간 기록
  const startRender = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
  }, [enabled]);

  // 렌더링 종료 시간 기록 및 메트릭 업데이트
  const endRender = useCallback(() => {
    if (!enabled || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    const currentMetrics = metrics.current;

    currentMetrics.renderCount += 1;
    currentMetrics.lastRenderTime = renderTime;
    currentMetrics.totalRenderTime += renderTime;
    currentMetrics.averageRenderTime =
      currentMetrics.totalRenderTime / currentMetrics.renderCount;

    // 임계값을 초과하는 렌더링 시간에 대해 경고
    if (renderTime > logThreshold) {
      console.warn(`🐌 [Performance] ${componentName} 느린 렌더링 감지:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${logThreshold}ms`,
        renderCount: currentMetrics.renderCount,
        averageTime: `${currentMetrics.averageRenderTime.toFixed(2)}ms`,
      });
    }

    // 개발 환경에서 주기적으로 성능 리포트 출력
    if (currentMetrics.renderCount % 50 === 0) {
      console.log(`📊 [Performance] ${componentName} 성능 리포트:`, {
        totalRenders: currentMetrics.renderCount,
        averageRenderTime: `${currentMetrics.averageRenderTime.toFixed(2)}ms`,
        lastRenderTime: `${currentMetrics.lastRenderTime.toFixed(2)}ms`,
        totalTime: `${currentMetrics.totalRenderTime.toFixed(2)}ms`,
      });
    }

    renderStartTime.current = 0;
  }, [enabled, componentName, logThreshold]);

  // 컴포넌트 마운트/업데이트 시 렌더링 시작 시간 기록
  startRender();

  // 렌더링 완료 후 종료 시간 기록
  useEffect(() => {
    endRender();
  });

  // 메트릭 반환 (읽기 전용)
  const getMetrics = useCallback((): IPerformanceMetrics => {
    return { ...metrics.current };
  }, []);

  // 메트릭 리셋
  const resetMetrics = useCallback(() => {
    metrics.current = {
      renderCount: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      totalRenderTime: 0,
    };
  }, []);

  return {
    getMetrics,
    resetMetrics,
    isEnabled: enabled,
  };
}

/**
 * 리렌더링 원인을 추적하는 훅
 */
export function useWhyDidYouUpdate(
  name: string,
  props: Record<string, any>,
  enabled: boolean = process.env.NODE_ENV === "development"
) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (!enabled) return;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log(
          `🔄 [Why-Did-You-Update] ${name} 리렌더링 원인:`,
          changedProps
        );
      }
    }

    previousProps.current = props;
  });
}

/**
 * 컴포넌트 마운트/언마운트 추적 훅
 */
export function useComponentLifecycle(
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === "development"
) {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    mountTime.current = performance.now();
    console.log(`🟢 [Lifecycle] ${componentName} 마운트됨`);

    return () => {
      const lifeTime = performance.now() - mountTime.current;
      console.log(
        `🔴 [Lifecycle] ${componentName} 언마운트됨 (생존시간: ${lifeTime.toFixed(
          2
        )}ms)`
      );
    };
  }, [componentName, enabled]);
}

/**
 * 메모리 사용량 모니터링 훅
 */
export function useMemoryMonitor(
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === "development"
) {
  const logMemoryUsage = useCallback(() => {
    if (!enabled || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    console.log(`💾 [Memory] ${componentName} 메모리 사용량:`, {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }, [componentName, enabled]);

  useEffect(() => {
    logMemoryUsage();
  });

  return { logMemoryUsage };
}
