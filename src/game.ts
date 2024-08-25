import * as PIXI from 'pixi.js';

/*class BallGame {
    private app: PIXI.Application;
    private ball: PIXI.Graphics;
    private velocity: { x: number, y: number };
    private speed: number;

    constructor() {
        this.app = new PIXI.Application({ width: 500, height: 500, backgroundColor: 0xffffff });
        document.body.appendChild(this.app.view);

        this.createField();
        this.ball = this.createBall();
        this.velocity = { x: 0, y: 0 };
        this.speed = 0;

        this.ball.interactive = true;
        this.ball.buttonMode = true;
        this.ball.on('pointerdown', this.onBallClick.bind(this));

        this.app.ticker.add(this.update.bind(this));
    }

    private createField(): void {
        const field = new PIXI.Graphics();
        field.lineStyle(5, 0x000000, 1);
        field.drawRect(0, 0, 500, 500);
        field.endFill();
        this.app.stage.addChild(field);
    }

    private createBall(): PIXI.Graphics {
        const ball = new PIXI.Graphics();
        ball.beginFill(0xff0000);
        ball.drawCircle(0, 0, 20);
        ball.endFill();
        ball.x = this.app.screen.width / 2;
        ball.y = this.app.screen.height / 2;
        this.app.stage.addChild(ball);
        return ball;
    }

    private onBallClick(): void {
        const angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 10 + 5;
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
    }

    private update(delta: number): void {
        this.ball.x += this.velocity.x * delta;
        this.ball.y += this.velocity.y * delta;

        this.speed *= 0.99;
        if (this.speed < 0.1) this.speed = 0;
        this.velocity.x = Math.cos(Math.atan2(this.velocity.y, this.velocity.x)) * this.speed;
        this.velocity.y = Math.sin(Math.atan2(this.velocity.y, this.velocity.x)) * this.speed;

        if (this.ball.x - 20 <= 0 || this.ball.x + 20 >= this.app.screen.width) {
            this.velocity.x *= -1;
            this.ball.x = Math.max(20, Math.min(this.ball.x, this.app.screen.width - 20));
        }

        if (this.ball.y - 20 <= 0 || this.ball.y + 20 >= this.app.screen.height) {
            this.velocity.y *= -1;
            this.ball.y = Math.max(20, Math.min(this.ball.y, this.app.screen.height - 20));
        }
    }
}*/

//new BallGame();
