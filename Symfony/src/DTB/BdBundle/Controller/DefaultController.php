<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;

class DefaultController extends Controller
{
    public function showAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        
        $bandeDessinee = $repository->find($id);
        
        return $this->render('DTBBdBundle:Default:show.html.twig', array('bd' => $bandeDessinee));
    }
    
    public function addPlancheAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        $bandeDessinee = $repository->find($id);
 
        $planche = new Planche();
        $planche->setBandeDessinee($bandeDessinee);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($planche);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
    }
    
    public function createAction()
    {
        $bandeDessinee = new BandeDessinee();
        
        $form = $this->createForm(new BandeDessineeType, $bandeDessinee);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $bandeDessinee->setCreator($this->getUser());
                $em = $this->getDoctrine()->getManager();
                $em->persist($bandeDessinee);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Default:create.html.twig', array('form' => $form->createView()));
    }
    
    public function updateAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        $bandeDessinee = $repository->find($id);
        
        $form = $this->createForm(new BandeDessineeType, $bandeDessinee);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $em = $this->getDoctrine()->getManager();
                $em->persist($bandeDessinee);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Default:update.html.twig', array('bd' => $bandeDessinee, 'form' => $form->createView()));
    }
}
