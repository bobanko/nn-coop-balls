class species{
  float[][] first_layer = new float[13][10];
  float[][] second_layer = new float[11][2];
  
  species(boolean random){
    if(random)
    {
      for(int i=0; i<13; i++)
        for(int j=0; j<10; j++)
          first_layer[i][j]=random(-1,1);
        
      for(int i=0; i<11; i++)
        for(int j=0; j<2; j++)
          second_layer[i][j]=random(-1,1);
    }
  }
  
  float[] calculateOutput(float[] input)
  {
    float[] hidden = new float[11];
    float[] output = new float[2];
    
    for(int i=0; i<10; i++)
      hidden[i]=0;
    hidden[10]=1; //bias
    
    for(int i=0; i<2; i++)
      output[i]=0;
    
    for(int i=0; i<10; i++)
      for(int j=0; j<13; j++)
        {
          hidden[i] += input[j]*first_layer[j][i];
          //activation function
          hidden[i] = (2/(1+exp(-2*hidden[i])))-1;
        }
        
    for(int i=0; i<2; i++)
      for(int j=0; j<11; j++)
      {
        output[i] += hidden[j]*second_layer[j][i];
        //activation function
        output[i] = (2/(1+exp(-2*output[i])))-1;
      }
    
    return output;
  }
  
 
  
  float[][] first_layer(){
    return first_layer;
  }
  
  float[][] second_layer(){
    return second_layer;
  }
  
  void set_layer(int layer, int i, int j, float value)
  {
     if(layer == 1)
       first_layer[i][j]=value;
     if(layer == 2)
       second_layer[i][j]=value;
  }
}