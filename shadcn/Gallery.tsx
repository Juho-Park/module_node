'use client'
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../../components/ui/carousel";
import { Button } from "../../components/ui/button";
import { XIcon } from "lucide-react";

export default function Gallery({ urls, onRemove }: {
  urls: string[]
  onRemove?: (index: number) => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrentIndex(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return <div className='space-y-2'>
    <Carousel setApi={setApi}>
      <CarouselContent>
        {urls.map((url, index) => (
          <CarouselItem key={index} className='flex items-center justify-center'>
            <div className='relative'>
              {onRemove && <Button
                type='button'
                size='icon'
                variant='secondary'
                className='absolute right-2 top-2 z-10 h-5 w-5 rounded-full'
                onClick={() => onRemove(index)}
                aria-label='선택한 영상 제거'
              >
                <XIcon className='h-4 w-4' />
              </Button>}
              <video
                src={url}
                controls
                playsInline
                preload='metadata'
                className='max-h-[300px]'
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    <div className='flex items-center justify-center gap-1.5'>
      {Array.from({ length: urls.length }).map((_, index) => {
        const isActive = currentIndex === index + 1
        return <button
          key={index}
          type='button'
          className={`h-2 w-2 rounded-full transition-colors ${isActive ? 'bg-foreground' : 'bg-muted-foreground/40'}`}
          aria-label={`${index + 1}번 미리보기`}
        />
      })}
    </div>
  </div>
}