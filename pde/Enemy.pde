class enemy{
  float vel;
  float posX, posY;
  int radius;
  
  enemy(int r, int v){
    radius = r;
    vel = v;
    posX = -radius;
    posY = random(radius, jsPageHeight-radius);
  }
  
  void updatePos(){
    posX += vel;
  }
  
  int getX(){
    return (int) posX;
  }
  
  int getY(){
    return (int) posY;
  }
  
  int getRadius(){
    return radius;
  }
  
  boolean intersect(ArrayList<defender> team){
    for(int i=0; i<team.size(); i++)
    {
      float dist = dist(posX,posY,team.get(i).getX(),team.get(i).getY());
      if(dist<(radius+team.get(i).getRadius()))
        return true;
    }
    return false;
  }
}