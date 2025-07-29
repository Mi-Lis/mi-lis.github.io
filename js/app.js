        // Получаем элементы шестерёнок
        const largeGear = document.getElementById('largeGear');
        const smallGear = document.getElementById('smallGear');
        const speedIndicator = document.getElementById('speedIndicator');
        
        // Переменные для отслеживания прокрутки
        let lastScrollY = window.scrollY;
        let rotationLarge = 0;
        let rotationSmall = 0;
        let lastTime = performance.now();
        let scrollSpeed = 0;
        let isScrolling = false;
        let scrollTimeout;
        
        // Функция для ограничения частоты вызовов
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
        
        // Функция обновления вращения шестерёнок
        function updateGears() {
            // Получаем текущую позицию прокрутки
            const currentScrollY = window.scrollY;
            const currentTime = performance.now();
            
            // Вычисляем разницу во времени и прокрутке
            const timeDelta = currentTime - lastTime;
            const scrollDelta = currentScrollY - lastScrollY;
            
            // Вычисляем скорость прокрутки (пиксели в секунду)
            if (timeDelta > 0) {
                scrollSpeed = Math.abs(scrollDelta) / (timeDelta / 1000);
            }
            
            // Обновляем угол поворота шестерёнок
            // Большая шестерёнка вращается медленнее
            rotationLarge += scrollDelta * 0.1;
            // Маленькая шестерёнка вращается быстрее и в противоположную сторону
            rotationSmall -= scrollDelta * 0.3;
            
            // Применяем вращение с использованием transform для плавности
            largeGear.style.transform = `rotate(${rotationLarge}deg)`;
            smallGear.style.transform = `rotate(${rotationSmall}deg)`;
            
            // Сохраняем текущие значения
            lastScrollY = currentScrollY;
            lastTime = currentTime;
            
            // Обновляем индикатор скорости (только для демонстрации)
            // speedIndicator.textContent = `Скорость прокрутки: ${Math.round(scrollSpeed)} px/s`;
            
            // Если пользователь всё ещё прокручивает, продолжаем анимацию
            if (isScrolling) {
                requestAnimationFrame(updateGears);
            }
        }
        
        // Обработчик события прокрутки
        const handleScroll = throttle(function() {
            // Если это первое событие прокрутки в этой серии
            if (!isScrolling) {
                isScrolling = true;
                lastScrollY = window.scrollY;
                lastTime = performance.now();
                // Запускаем анимацию
                requestAnimationFrame(updateGears);
                // Показываем индикатор скорости
                // speedIndicator.style.display = 'block';
            }
            
            // Очищаем предыдущий таймер
            clearTimeout(scrollTimeout);
            
            // Устанавливаем новый таймер для остановки анимации
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                // Скрываем индикатор скорости через 1 секунду после остановки
                setTimeout(() => {
                    speedIndicator.style.display = 'none';
                }, 1000);
            }, 100);
        }, 16); // Ограничиваем частоту вызовов до 60 FPS
        
        // Добавляем обработчик события прокрутки
        window.addEventListener('scroll', handleScroll);
        
        // Инициализация позиций шестерёнок
        window.addEventListener('load', () => {
            lastScrollY = window.scrollY;
        });