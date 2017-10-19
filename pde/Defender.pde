class defender{
int radius = 35;
float max_acc = 0.1;
float max_vel = 2;

float accX, accY;
float velX, velY;
float posX, posY;

  
  defender(int current, int total){
    accX = 0;
    accY = 0;
    velX = 0;
    velY = 0;
    //posX = random(600+radius,800-radius);
    //posY = random(radius, jsPageHeight-radius);
    posX = (int) (300+radius + 800-radius)/2;
    posY = (int) (jsPageHeight/total)*current;
  }
  
  void change_acc(float changeX, float changeY)
  {
    accX += changeX;
    accY += changeY;
    accX = limit(accX, max_acc, -max_acc);
    accY = limit(accY, max_acc, -max_acc);
      
    velX += accX;
    velY += accY;
    velX = limit(velX, max_vel, -max_vel);
    velY = limit(velY, max_vel, -max_vel);
    
    posX += velX;
    posY += velY;
    posX = limit(posX, 800-radius, 300+radius);  
    posY = limit(posY, jsPageHeight-radius, radius);
  }
  
  int getRadius(){
    return radius;
  }
  
  int getX(){
    return (int) posX;
  }
  
  int getVelY(){
    return (int) velY;
  }
  
  int getVelX(){
    return (int) velX;
  }
  
  int getY(){
    return (int) posY;
  }
  
}

float limit(float value, float max, float min){
  if(value<min)
    return min;
  if(value>max)
    return max;
  return value;
}