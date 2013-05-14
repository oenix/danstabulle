<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class DefaultController extends Controller
{
    public function showAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        
        $bandeDessinee = $repository->find($id);
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Default:show.html.twig', array('bd' => $bandeDessinee,
            'role' => $role));
    }
    
    public function addPlancheAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
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
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
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
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
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
